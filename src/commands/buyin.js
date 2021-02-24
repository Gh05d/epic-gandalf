const { getPlayer } = require("../helpers");
const {
  Tournament,
  PlayerTournament,
  sequelize,
} = require("../sequelizeSetup");

module.exports = {
  name: "buyin",
  aliases: ["buy-in"],
  admin: true,
  description: "Lets a player buyin to a running tournament",
  execute: async (message, players) => {
    if (players.length < 1) {
      return message.reply(
        "please add at least one player to the command like this $buyin [player]"
      );
    }

    const tournament = await Tournament.findOne({
      where: { status: "running" },
      raw: true,
    });

    if (tournament) {
      await sequelize.transaction(async ta => {
        try {
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
        `New buyin. Good luck to ${players.join(", ")} 💪`
      );
    } else {
      return message.reply(
        "sorry, there is no tournament running. Create one via $poker-start"
      );
    }
  },
};
