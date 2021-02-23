const { GANDALF_GIF, GANDALF_AUDIO } = require("../constants");
const { playSound } = require("../helpers");

module.exports = {
  name: "epic",
  aliases: ["epic-sax"],
  async execute(message) {
    const startMessage = {
      embed: { title: "Epic Sorcerer 🎷", image: { url: GANDALF_GIF } },
    };

    const endMessage = "Stopped being epic 😔";
    return await playSound(GANDALF_AUDIO, message, startMessage, endMessage);
  },
};
