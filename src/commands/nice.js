const Path = require("path");
const { playSound } = require("../helpers");

module.exports = {
  name: "nice",
  execute: async message =>
    await playSound(Path.resolve(__dirname, "./../..", "assets", "nice.webm"), message),
};
