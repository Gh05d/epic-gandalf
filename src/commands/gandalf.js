const GANDALF_GIF = require("../constants.js");

module.exports = {
  name: "gandalf",
  async execute(message) {
    return await message.channel.send({
      embed: { image: { url: GANDALF_GIF } },
    });
  },
};
