const Path = require("path");
const { playSound } = require("../helpers");

module.exports = {
  name: "ballern",
  aliases: ["baller"],
  execute: async message =>
    await playSound(
      Path.resolve(__dirname, "../..", "assets", "ballern.webm"),
      message
    ),
};
