const { getPlayer } = require("../helpers");
const {
  Tournament,
  PlayerTournament,
  sequelize,
} = require("../sequelizeSetup");

module.exports = {
  name: "poker-start",
  aliases: [
    "pokre",
    "pogre",
    "poker",
    "pokre-start",
    "poker-new",
    "new-tournament",
    "create-tournament",
  ],
  admin: true,
  description: "Starts a new tournament",
  execute: async (message, players) => {
    const alreadyStarted = await Tournament.findOne({
      where: { status: "running" },
      raw: true,
    });

    if (!alreadyStarted) {
      await sequelize.transaction(async ta => {
        try {
          const tournament = await Tournament.create({}, { transaction: ta });

          return await Promise.all(
            players.map(player => {
              const { id } = getPlayer(player);

              return PlayerTournament.create(
                { player_id: id, tournament_id: tournament.id },
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
        "sorry, there is already a tournament running. Finish it via $poker-finish [winner] [second] or $poker-abort."
      );
    }
  },
};
