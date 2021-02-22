const Fs = require("fs");
const { POKER_CHANNEL_ID, GANDALF_GIF, GANDALF_AUDIO, client } = require("../constants");

module.exports = {
  name: "epic",
  aliases: ["epic-sax"],
  async execute(message) {
    const voiceChannel = await client.channels.cache.get(POKER_CHANNEL_ID);

    let joinedChannel = await voiceChannel.join();

    const dispatcher = joinedChannel.play(
      Fs.createReadStream(GANDALF_AUDIO, { type: "webm/opus" })
    );

    dispatcher.on(
      "start",
      async () =>
        await message.channel.send({
          embed: {
            title: "Epic Sorcerer 🎷",
            image: {
              url: GANDALF_GIF,
            },
          },
        })
    );

    dispatcher.on("finish", () => {
      message.channel.send("Stopped being epic 😔");
      joinedChannel.leave();
    });

    dispatcher.on("on", error => {
      console.error(error);
      message.reply(`sorry, couldn't start being epic 💩 There was this problem: ${error.message}`);
    });

    return;
  },
};
