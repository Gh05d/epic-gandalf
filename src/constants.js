const Path = require("path");
const Discord = require("discord.js");
const { readFileSync } = require("fs");
const client = new Discord.Client();

client.commands = new Discord.Collection();

const players = {};

readFileSync(Path.resolve(__dirname, "../", "assets", "players.txt"))
  .toString()
  .split("\n")
  .forEach(player => {
    const [key, value] = player.split(":");
    players[key.trim()] = value.trim();
  });

module.exports = {
  GANDALF_VIDEO: "https://i.imgur.com/DOVqVvh.mp4",
  GANDALF_AUDIO: Path.resolve("./", "assets", "epic_sax_gandalf.webm"),
  GANDALF_GIF:
    "https://media1.tenor.com/images/cc7f226783133f6088c33e871a048c2e/tenor.gif?itemid=3551563",
  POKER_CHANNEL_ID: "777166327466950656",
  client,
  players,
};
