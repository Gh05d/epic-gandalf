const {
  Tournament,
  sequelize,
  PlayerTournament,
  TournamentView,
} = require("../sequelizeSetup");
const { getPlayer, computeMoneyDistribution } = require("../helpers");
const { pollingEnd } = require("../google");
const { client } = require("../constants");

module.exports = {
  name: "poker-finish",
  aliases: ["poker-end", "poker-stop", "finish", "tournament-finish"],
  description: "Stops a running poker tournament",
  admin: true,
  execute: async (message, rankings) => {
    function positionIcon(position) {
      switch (position) {
        case 1:
          return "🏆";

        case 2:
          return "🥈";

        case 3:
          return "🥉💩";

        default:
          return "💩";
      }
    }

    const misuseReply =
      "the proper command looks like this: $poker-finish [winner] [second]";

    if (rankings.length == 0 || rankings.length != 2) {
      return message.reply(misuseReply);
    }

    try {
      const tournament = await TournamentView.findOne({
        where: { status: "running" },
        raw: true,
      });

      if (!tournament) {
        return message.reply("sorry, there seems to be no tournament running");
      }

      await sequelize.transaction(async ta => {
        try {
          const rankingPromises = rankings.map((player, i) => {
            const { id: player_id } = getPlayer(player);

            PlayerTournament.update(
              { position: i + 1 },
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

      const allPositions = await PlayerTournament.findAll({
        where: { tournament_id: tournament.id },
        raw: true,
      });

      const positions = allPositions.sort((a, b) => a.position - b.position);
      const money = computeMoneyDistribution(tournament);

      const [winner, second] = rankings;
      pollingEnd();

      return message.channel.send({
        embed: {
          color: "#FFD700",
          title: "Tournament finished",
          description: `The tournament is over. Congrats to the winner ${winner} 🥇 and the second place ${second}🥈\n
           ${tournament.players
             .filter(name => name != winner && name != second)
             .join(", ")}, IHR SEID SCHEISSE!!! 💩`,
          fields: [
            {
              name: "Money Distribution",
              value: tournament.buy_ins > 6 ? "60 / 20 / 10" : "70 / 30",
            },
            ...positions.map(({ player_id }, i) => ({
              name: `${i + 1}. Platz ${positionIcon(i + 1)}`,
              value: `${client.players.get(player_id).name} ${
                money[i] ? money[i].value : ""
              }`,
            })),
          ],
        },
      });
    } catch (error) {
      pollingEnd();
      throw new Error(error);
    }
  },
};
