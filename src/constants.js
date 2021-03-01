const Path = require("path");
const Discord = require("discord.js");
const client = new Discord.Client();

client.commands = new Discord.Collection();

module.exports = {
  GANDALF_VIDEO: "https://i.imgur.com/DOVqVvh.mp4",
  GANDALF_AUDIO: Path.resolve("./", "assets", "epic_gandalf.ogg"),
  GANDALF_GIF:
    "https://media1.tenor.com/images/cc7f226783133f6088c33e871a048c2e/tenor.gif?itemid=3551563",
  POKER_TEXT_CHANNEL:
    process.env.ENVIRONMENT == "development"
      ? "811557367744430130"
      : "812083914201759825",
  POKER_VOICE_CHANNEL: "777166327466950656",
  client,
  // If modifying these scopes, delete token.json.
  SCOPES: ["https://www.googleapis.com/auth/gmail.readonly"],
  // The file token.json stores the user's access and refresh tokens, and is
  // created automatically when the authorization flow completes for the first
  // time.
  TOKEN_PATH: "token.json",
};
