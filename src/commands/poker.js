const { getPlayerID } = require("../helpers");
const { Tournament, PlayerTournament, sequelize } = require("../sequelizeSetup");

module.exports = {
  name: "poker",
  aliases: ["pokre", "pogre", "poker-start", "pokre-start"],
  execute: async (message, players) => {
    if (players.length < 2) {
      return message.reply("please add at least two players to the command");
    }

    const alreadyStarted = await Tournament.findOne({ where: { status: "running" } });

    if (!alreadyStarted) {
      await sequelize.transaction(async ta => {
        try {
          const tournament = await Tournament.create({});

          return await Promise.all(
            players.map(player => {
              const playerID = getPlayerID(player);

              return PlayerTournament.create(
                { player_id: playerID, tournament_id: tournament.id },
                { transaction: ta }
              );
            })
          );
        } catch (error) {
          throw new Error(error);
        }
      });

      return message.channel.send(
        `Starting Poker Tournament. Good luck to ${players.join(", ")} 💪`
      );
    } else {
      return message.reply(
        "sorry, there is already a tournament running. Finish it via $poker-stop abort or $poker-stop finish [winner] [second]"
      );
    }
  },
};
