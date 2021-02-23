const Path = require("path");
const { playSound } = require("../helpers");

module.exports = {
  name: "ohh",
  aliases: ["oh"],
  execute: async message =>
    await playSound(Path.resolve(__dirname, "./../..", "assets", "ooh.webm"), message),
};
