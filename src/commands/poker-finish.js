const {
  Tournament,
  sequelize,
  PlayerTournament,
  TournamentView,
} = require("../sequelizeSetup");
const { getPlayer } = require("../helpers");

module.exports = {
  name: "poker-finish",
  aliases: ["poker-end", "poker-stop", "finish", "tournament-finish"],
  description: "Stops a running poker tournament",
  admin: true,
  execute: async (message, rankings) => {
    const misuseReply =
      "the proper command looks like this: Either $poker-stop abort or $poker-stop finish [winner] [second]";

    if (rankings.length == 0) {
      return message.reply(misuseReply);
    }
    const tournament = await TournamentView.findOne({
      where: { status: "running" },
      raw: true,
    });

    if (!tournament) {
      return message.reply("sorry, there seems to be no tournament running");
    }

    if (rankings.length < 2) {
      return message.reply("please provide at least first and second place");
    }

    await sequelize.transaction(async ta => {
      try {
        const rankingPromises = rankings.map((player, i) => {
          const { id: player_id } = getPlayer(player);

          PlayerTournament.increment(
            { position: 1 },
            {
              where: { tournament_id: tournament.id, player_id },
              transaction: ta,
            }
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

    return message.channel.send({
      embed: {
        title: "Tournament finished",
        description: `The tournament id over. Congrats to the winner ${winner} 🥇 and the second place ${second}🥈\n${losers.join(
          ", "
        )}, IHR SEID SCHEISSE! 💩`,
        fields: rankings.map((player, i) => ({
          name: `${i + 1}. Platz`,
          value: player,
        })),
      },
    });
  },
};
