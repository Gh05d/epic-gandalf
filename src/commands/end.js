const { POKER_VOICE_CHANNEL, client } = require("../constants.js");

module.exports = {
  name: "end",
  aliases: ["stop", "not-epic"],
  description: "Stops any voice activity a bot is currently doing",
  admin: true,
  async execute() {
    const voiceChannel = await client.channels.cache.get(POKER_VOICE_CHANNEL);

    await voiceChannel.leave();
  },
};
