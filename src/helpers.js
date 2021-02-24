const Fs = require("fs");
const { POKER_CHANNEL_ID, client } = require("./constants");

module.exports = {
  getPlayer: nickname => {
    const player = client.players.find(
      ({ name }) => name == nickname.toLowerCase()
    );

    if (!player) {
      throw new Error(`Couldn't find a player named ${nickname}`);
    }

    return player;
  },
  playSound: async (sound, message, startMessage, endMessage) => {
    const voiceChannel = await client.channels.cache.get(POKER_CHANNEL_ID);
    let joinedChannel = await voiceChannel.join();

    const dispatcher = joinedChannel.play(
      Fs.createReadStream(sound, { type: "webm/opus" })
    );

    dispatcher.on("start", async () => {
      if (startMessage) {
        await message.channel.send(startMessage);
      }
    });

    dispatcher.on("finish", () => {
      if (endMessage) {
        message.channel.send(endMessage);
      }
      voiceChannel.leave();
    });

    dispatcher.on("on", error => {
      console.error(error);
      message.reply(
        `sorry, couldn't start being epic 💩 There was this problem: ${error.message}`
      );
    });
  },
  computeMoneyDistribution: tournament => {
    const priceMoney = parseInt(tournament.price_pool);

    const percentageFirst = tournament.buy_ins > 6 ? 0.6 : 0.7;

    const results = [
      {
        name: "Winner 🏆",
        value: `${priceMoney * percentageFirst} €`,
        inline: true,
      },
      { name: "Second 🥈", value: `${priceMoney * 0.3} €`, inline: true },
    ];

    if (tournament.buy_ins > 6) {
      results.push({
        name: "Third 🥉",
        value: `${priceMoney * 0.1} €`,
        inline: true,
      });
    }

    return results;
  },
};
