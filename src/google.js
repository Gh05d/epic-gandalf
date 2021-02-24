const Fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const { client } = require("./constants");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

module.exports = {
  pollingStart: () => {
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
    clearInterval(client.interval);
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
 * Read emails.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function getEmails(auth) {
  try {
    const gmail = google.gmail({ version: "v1", auth });
    const res = await gmail.users.messages.list({
      userId: "me",
      q: `from:(service@paypal.de) subject:(Sie haben eine Zahlung erhalten) (poker || pokre) after:${new Date().getFullYear()}/1/1`,
    });

    if (res.status != 200) {
      throw new Error(res.status);
    }

    const promises = res.data.messages.map(message =>
      gmail.users.messages.get({ userId: "me", id: message.id })
    );

    const messages = await Promise.all(promises);
    messages.forEach(message => console.info(message.data.snippet + "\n"));
  } catch (error) {
    throw new Error(error);
  }
}
