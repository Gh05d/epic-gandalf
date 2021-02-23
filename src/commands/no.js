const Path = require("path");
const { playSound } = require("../helpers");

module.exports = {
  name: "no",
  aliases: ["no-god", "no-god-please-no", "god-no"],
  execute: async message =>
    await playSound(Path.resolve(__dirname, "./../..", "assets", "no-god.webm"), message),
};
