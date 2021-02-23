const { computeMoneyDistribution } = require("../helpers");
const { TournamentView } = require("../sequelizeSetup");

module.exports = {
  name: "info",
  aliases: ["game-info", "game-statistics"],
  async execute(message) {
    try {
      const tournament = await TournamentView.findOne({
        where: { status: "running" },
        raw: true,
      });

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
    } catch (error) {
      throw new Error(error);
    }
  },
};
