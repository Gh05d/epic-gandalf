const { Tournament, sequelize, PlayerTournament } = require("../sequelizeSetup");
const { getPlayerID } = require("../helpers");

module.exports = {
  name: "poker-stop",
  aliases: ["poker-end", "poker-finish"],
  description: "Stops a running poker tournament",
  execute: async (message, args) => {
    const misuseReply =
      "the proper command looks like this: Either $poker-stop abort or $poker-stop finish [winner] [second]";

    if (args.length == 0) {
      return message.reply(misuseReply);
    }
    const tournament = await Tournament.findOne({ where: { status: "running" }, raw: true });

    if (!tournament) {
      return message.reply("sorry, there seems to be no tournament running");
    }

    const [status, ...rankings] = args;

    if (status == "abort") {
      await Tournament.update({ status: "aborted" }, { where: { status: "running" } });

      return message.channel.send("Aborted current Poker Tournament");
    } else if (status == "finish") {
      if (rankings.length < 2) {
        return message.reply("please provide at least first and second place");
      }

      await sequelize.transaction(async ta => {
        try {
          const rankingPromises = rankings.map((player, i) => {
            const player_id = getPlayerID(player);

            PlayerTournament.update(
              { position: i + 1 },
              { where: { tournament_id: tournament.id, player_id }, transaction: ta }
            );
          });

          return await Promise.all([
            ...rankingPromises,
            Tournament.update(
              { status: "finished" },
              { where: { id: tournament.id }, transaction: ta }
            ),
          ]);
        } catch (error) {
          throw new Error(error);
        }
      });

      const [winner, second, ...losers] = rankings;

      return message.channel.send(
        `The tournament id over. Congrats to the winner ${winner} 🥇 and the second place ${second}🥈. ${losers.join(
          ", "
        )}, IHR SEID SCHEISSE! 💩`
      );
    } else {
      return message.reply(misuseReply);
    }
  },
};
