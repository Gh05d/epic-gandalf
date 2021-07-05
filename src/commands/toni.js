const Path = require("path");
const { playSound } = require("../helpers");

module.exports = {
  name: "toni",
  aliases: ["assi-toni"],
  execute: async (message, [arg]) => {
    // All stolen from https://www.sound-board.de/board/8
    const wisdom = [
      "abgefuckt",
      "ach",
      "arsch-vorbei",
      "assi",
      "aufregen",
      "bam",
      "bambam",
      "blöd",
      "brennt",
      "eier",
      "epic",
      "erzähl",
      "fett",
      "flatsch",
      "flennen",
      "geil",
      "gelaber",
      "gleich",
      "kotz",
      "nutten",
      "orgasmus",
      "peinlich",
      "peinlich2",
      "romantisch",
      "titten",
      "traummann",
      "verlieben",
    ];

    if (arg) {
      inList = wisdom.find(item => item == arg);

      if (arg && arg == "info") {
        return message.reply(
          `just write $toni for a random soundfile, for a specific one, use $toni [sound] with one of these as sound parameter: ${wisdom.join(
            ", "
          )}`
        );
      }
      if (!inList) {
        return message.reply(
          "could not find that command. Use $toni info for all sounds!"
        );
      }
    } else {
      arg = wisdom[Math.floor(Math.random() * wisdom.length)];
    }

    await playSound(
      Path.resolve(__dirname, "./../..", "assets", "toni", `toni-${arg}.webm`),
      message
    );
  },
};
