const Fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const { client, POKER_TEXT_CHANNEL } = require("./constants");
const { Tournament } = require("./sequelizeSetup");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

let historyId = null;
let channel = null;

module.exports = {
  pollingStart: () => {
    channel = client.channels.cache.get(POKER_TEXT_CHANNEL);
    console.log("Started polling 👂");
    client.interval = setInterval(() => {
      // Load client secrets from a local file.
      Fs.readFile("credentials.json", (err, content) => {
        if (err) {
          return console.log("Error loading client secret file:", err);
        }
        // Authorize a client with credentials, then call the Gmail API.
        authorize(JSON.parse(content), getEmails);
      });
    }, 10000);
  },
  pollingEnd: () => {
    historyId = null;
    clearInterval(client.interval);
    console.log("Stopped polling 🛑");
  },
};

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  Fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", code => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) {
        return console.error("Error retrieving access token", err);
      }
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      Fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Fetches unread messages and returns the most current historyId
 *
 * @param {object[]} list List of all new messages
 * @param {google.auth.OAuth2} gmail A gmail client
 *
 * @returns {string} historyId
 */
async function fetchMessages(list, gmail) {
  try {
    const promises = list.map(message =>
      gmail.users.messages.get({ userId: "me", id: message.id })
    );

    const messages = await Promise.all(promises);
    const paypalNames = client.players.map(({ name, paypal_name }) => ({
      paypal: paypal_name,
      name,
    }));

    if (messages && messages.length > 0) {
      const [tournament] = await Tournament.findOrCreate({
        where: { status: "running" },
      });

      console.log(tournament.id);

      messages.forEach(message => {
        const found = paypalNames.find(({ paypal }) =>
          message.data.snippet.includes(paypal)
        );

        if (found) {
          channel.send(`${found.name} has signed up for the tournament`);
        }
        console.info("-" + found + "\n");
      });

      return messages[0].data.historyId;
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Read emails.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function getEmails(auth) {
  try {
    const gmail = google.gmail({ version: "v1", auth });

    const query = historyId ? "history" : "messages";

    const res = await gmail.users[query].list({
      userId: "me",
      maxResults: 50,
      [`labelId${historyId ? "" : "s"}`]: "Label_7895777057724617755",
      //   q: `from:(service@paypal.de) subject:(Sie haben eine Zahlung erhalten) (poker || pokre || Poker || Pokre || pogre || Pogre) after:${new Date().getFullYear()}/${new Date().getMonth()}/1`,
      q: `from:(pc@vipfy.store) subject:(Sie haben eine Zahlung erhalten) (poker || pokre || Poker || Pokre || pogre || Pogre) after:${new Date().getFullYear()}/${new Date().getMonth()}/1`,
      startHistoryId: historyId,
    });

    if (res.status != 200) {
      throw new Error(res.status);
    }

    if (res.data) {
      if (res.data.messages) {
        historyId = await fetchMessages(res.data.messages, gmail);

        // client.commands.get("buyin").execute();
      } else if (res.data.history) {
        await fetchMessages(res.data.history[0].messages, gmail);

        historyId = res.data.historyId;
      } else if (!res.data.history && res.data.historyId) {
        console.log("No new messages", res.data.historyId);
      }
    }
  } catch (error) {
    throw new Error(error);
  }
}
