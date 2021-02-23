const Path = require("path");
const Discord = require("discord.js");
const client = new Discord.Client();

client.commands = new Discord.Collection();

module.exports = {
  GANDALF_VIDEO: "https://i.imgur.com/DOVqVvh.mp4",
  GANDALF_AUDIO: Path.resolve("./", "assets", "epic_gandalf.ogg"),
  GANDALF_GIF:
    "https://media1.tenor.com/images/cc7f226783133f6088c33e871a048c2e/tenor.gif?itemid=3551563",
  POKER_CHANNEL_ID: "777166327466950656",
  client,
};
