const Fs = require("fs");
const { POKER_VOICE_CHANNEL, client } = require("./constants");
const { PlayerTournament, sequelize } = require("./sequelizeSetup");

function getPlayer(nickname) {
  const player = client.players.find(
    ({ name }) => name == nickname.toLowerCase()
  );

  if (!player) {
    throw new Error(`Couldn't find a player named ${nickname}`);
  }

  return player;
}

module.exports = {
  getPlayer,
  /**
   * Bot joins the poker voice channel and plays a sound there
   *
   * @param {string} sound Link to the soundfile
   * @param {object} message The message object so that the function can set messages to the channel
   * @param {string} [startMessage] Optional message to be played at the start of the sound
   * @param {string} [endMessage] Optional message to be played at the end of the sound
   */
  playSound: async (sound, message, startMessage, endMessage) => {
    const voiceChannel = await client.channels.cache.get(POKER_VOICE_CHANNEL);
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
        value: `${(priceMoney * percentageFirst).toFixed(2)} €`,
        inline: true,
      },
      {
        name: "Second 🥈",
        value: `${(priceMoney * 0.3).toFixed(2)} €`,
        inline: true,
      },
    ];

    if (tournament.buy_ins > 6) {
      results.push({
        name: "Third 🥉",
        value: `${(priceMoney * 0.1).toFixed(2)} €`,
        inline: true,
      });
    }

    return results;
  },
  signupPlayers: async (tournament_id, players) => {
    try {
      await sequelize.transaction(async ta => {
        try {
          return await Promise.all(
            players.map(player => {
              const { id } = getPlayer(player);

              return PlayerTournament.create(
                { player_id: id, tournament_id },
                { transaction: ta }
              );
            })
          );
        } catch (error) {
          throw new Error(error);
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  },
};
