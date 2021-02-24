const { computeMoneyDistribution } = require("../helpers");
const { TournamentView, Tournament } = require("../sequelizeSetup");

module.exports = {
  name: "info",
  aliases: ["game-info", "game-statistics"],
  async execute(message) {
    try {
      const condition = { where: { status: "running" }, raw: true };
      const [newOne, tournament] = await Promise.all([
        Tournament.findOne(condition),
        TournamentView.findOne(condition),
      ]);

      if (!newOne) {
        return message.reply(
          "sorry, there seems to be no running tournament. Start one via $poker-new to change that."
        );
      } else if (newOne && !tournament) {
        return message.reply(
          "there are no sign-ups for the current tournament. Use $buyin [player] to change that."
        );
      } else {
        const moneyDistribution = computeMoneyDistribution(tournament);

        return await message.channel.send({
          embed: {
            color: "#FFD700",
            title: "Statistics for the current game",
            fields: [
              { name: "Players", value: tournament.players.join(", ") },
              { name: "Buy-ins", value: tournament.amount_players },
              { name: "Rebuys", value: tournament.rebuys },
              { name: "Pricepool", value: `${tournament.price_pool} €` },
              {
                name: "Money Distribution",
                value: tournament.buy_ins > 6 ? "60 / 20 / 10" : "70 / 30",
              },
              ...moneyDistribution,
            ],
          },
        });
      }
    } catch (error) {
      throw new Error(error);
    }
  },
};
