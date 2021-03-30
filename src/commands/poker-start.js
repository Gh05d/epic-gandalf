const { getPlayer } = require("../helpers");
const { pollingStart, pollingEnd } = require("../google");
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
    try {
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

        players.forEach(player => {
          const { id } = getPlayer(player);

          message.channel.send(`!pac <@${id}> 5000`);
        });

        pollingStart();

        return message.channel.send(
          `Good luck to ${players.join(
            ", "
          )} 💪. Enter !png 10 20 \n to start the Poker Tournament.`
        );
      } else {
        return message.reply(
          "sorry, there is already a tournament running. Finish it via $poker-finish [winner] [second] or $poker-abort."
        );
      }
    } catch (error) {
      pollingEnd();
      throw new Error(error);
    }
  },
};
