const Fs = require("fs");
const { google } = require("googleapis");
const { client, SCOPES, TOKEN_PATH } = require("./constants");

let OWNER;

function manualAuthorization() {
  OWNER = client.users.cache.get("295126062265008128");

  // Load client secrets from a local file.
  Fs.readFile("google-credentials.json", (err, content) => {
    if (err) {
      return console.log("Error loading client secret file:", err);
    }
    // Authorize a client with credentials, then call the Gmail API.
    authorize(JSON.parse(content));
  });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 */
function authorize(credentials) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  Fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      return getNewToken(oAuth2Client);
    }
    oAuth2Client.setCredentials(JSON.parse(token));
    OWNER.send("Successfully authorized");
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 */
function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  client.oAuth2Client = oAuth2Client;

  OWNER.send(`Authorize this app by visiting this url: ${authUrl}`);
}

function sendToken(code) {
  client.oAuth2Client.getToken(code, (err, token) => {
    if (err) {
      return console.error("Error retrieving access token", err);
    }

    client.oAuth2Client.setCredentials(token);
    // Store the token to disk for later program executions
    Fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
      if (err) {
        return console.error(err);
      }
      console.log("Token stored to", TOKEN_PATH);
    });

    OWNER.send("Successfully authorized");
  });
}

module.exports = {
  manualAuthorization,
  sendToken,
};
