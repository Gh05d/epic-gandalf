const Fs = require("fs");
const Path = require("path");
const Discord = require("discord.js");
const { google } = require("googleapis");
const readline = require("readline");
const {
  client,
  POKER_TEXT_CHANNEL,
  POKER_VOICE_CHANNEL,
  SCOPES,
  TOKEN_PATH,
} = require("./constants");
const { Tournament, PlayerTournament } = require("./sequelizeSetup");
const { signupPlayers } = require("./helpers");

let historyId = null;
let channel = null;

module.exports = {
  pollingStart: () => {
    channel = client.channels.cache.get(POKER_TEXT_CHANNEL);
    console.log("Started polling 👂");

    client.interval = setInterval(() => {
      Fs.readFile("google-credentials.json", (err, content) => {
        if (err) {
          return console.log("Error loading client secret file:", err);
        }

        authorize(JSON.parse(content), getEmails);
      });
    }, 10000);
  },
  pollingEnd: () => {
    clearInterval(client.interval);
    console.log("Stopped polling 🛑");
  },
  authorize,
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
    if (err) {
      return getNewToken(oAuth2Client, callback);
    }
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
  let messages = null;
  let paypalNames = null;

  try {
    const promises = list.map(message =>
      gmail.users.messages.get({ userId: "me", id: message.id })
    );

    messages = await Promise.all(promises);
    paypalNames = client.players.map(({ name, paypal_name, id }) => ({
      paypal: paypal_name,
      name,
      id,
    }));
  } catch (error) {
    throw new Error(error);
  }

  if (messages && messages.length > 0) {
    const { historyId } = messages[0].data;

    try {
      const [tournament] = await Tournament.findOrCreate({
        where: { status: "running" },
      });

      const buyins = [];
      const rebuys = [];
      let attachment;

      messages.forEach(message => {
        const found = paypalNames.find(({ paypal }) =>
          message.data.snippet.includes(paypal)
        );

        if (found) {
          const isRebuy =
            message.data.snippet.includes("rebuy") ||
            message.data.snippet.includes("Rebuy") ||
            message.data.snippet.includes("REBUY");

          if (isRebuy) {
            rebuys.push(found);
          } else {
            buyins.push(found);
          }

          console.info(`- ${isRebuy ? "Rebuy" : "Buy-in"}: ${found.paypal} \n`);
        }
      });

      if (buyins.length > 0) {
        await signupPlayers(
          tournament.id,
          buyins.map(({ name }) => name)
        );
      }

      if (rebuys.length > 0) {
        await Promise.all(
          rebuys.map(player =>
            PlayerTournament.increment(
              { rebuys: 1 },
              { where: { player_id: player.id, tournament_id: tournament.id } }
            )
          )
        );

        attachment = new Discord.MessageAttachment(
          Path.resolve(__dirname, "../", "assets", "smile.png"),
          "smile.png"
        );
      }

      [...buyins, ...rebuys].forEach(({ id }) =>
        channel.send(`!pac <@${id}> 5000`)
      );

      const voiceChannel = await client.channels.cache.get(POKER_VOICE_CHANNEL);
      let joinedChannel = await voiceChannel.join();

      const dispatcher = joinedChannel.play(
        Fs.createReadStream(
          Path.resolve(
            __dirname,
            "../",
            "assets",
            rebuys.length > 0 ? "epic_gandalf.ogg" : "nice.webm"
          ),
          { type: "webm/opus" }
        )
      );

      dispatcher.on("start", async () => {
        await channel.send(
          rebuys.length > 0
            ? {
                embed: {
                  title: "Re re re re re reeeeeeeeeeebuy",
                  description: `${rebuys
                    .map(({ name }) => name)
                    .join(", ")} ha${
                    rebuys.length > 1 ? "ve" : "s"
                  } made a rebuy`,
                  files: [attachment],
                  image: { url: "attachment://smile.png" },
                },
              }
            : `${buyins.map(({ name }) => name).join(", ")} ha${
                buyins.length > 1 ? "ve" : "s"
              } signed up for the tournament 🃏`
        );
      });

      dispatcher.on("finish", () => voiceChannel.leave());

      dispatcher.on("on", error => console.error("Something wrong", error));

      return historyId;
    } catch (error) {
      if (error.message.includes("SequelizeUniqueConstraintError")) {
        console.log(
          `Player is already signed up for the tournament -> ${error.message}`
        );

        return historyId;
      } else {
        throw new Error(error);
      }
    }
  } else {
    return null;
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
    const today = new Date();

    const res = await gmail.users[query].list({
      userId: "me",
      maxResults: 50,
      //[`labelId${historyId ? "" : "s"}`]: "Label_7895777057724617755",
      q: `from:(${
        process.env.ENVIRONMENT == "development"
          ? "pc@vipfy.store"
          : "service@paypal.de"
      }) subject:(Sie haben eine Zahlung erhalten) (rebuy || Rebuy || REBUY || poker || pokre || Poker || Pokre || pogre || Pogre) after:${today.getFullYear()}/${
        today.getMonth() + 1
      }/${today.getDate()}`,
      startHistoryId: historyId,
    });

    if (res.status != 200) {
      throw new Error(res.status);
    }

    if (res.data) {
      if (res.data.messages) {
        historyId = await fetchMessages(res.data.messages, gmail);
      } else if (res.data.history) {
        await fetchMessages(res.data.history[0].messages, gmail);

        historyId = res.data.historyId;
      } else if (!res.data.history && res.data.historyId) {
        console.log("No new messages", res.data.historyId);
      }
    } else {
      console.log("Nothing", res);
    }
  } catch (error) {
    throw new Error(error);
  }
}
