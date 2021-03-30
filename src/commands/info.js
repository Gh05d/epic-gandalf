const { computeMoneyDistribution } = require("../helpers");
const { client } = require("../constants");
const {
  TournamentView,
  Tournament,
  PlayerTournament,
} = require("../sequelizeSetup");

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

        const positions = await PlayerTournament.findAll({
          where: { tournament_id: tournament.id },
          raw: true,
        });

        const finished = [];
        const active = [];

        positions.forEach(({ position, player_id }) => {
          if (position) {
            finished.push(client.players.get(player_id).name);
          } else {
            active.push(client.players.get(player_id).name);
          }
        });

        return await message.channel.send({
          embed: {
            color: "#FFD700",
            title: "Statistics for the current game",
            fields: [
              { name: "Players", value: tournament.players.join(", ") },
              { name: "Buy-ins", value: tournament.amount_players },
              { name: "Rebuys", value: tournament.rebuys },
              { name: "Pricepool", value: `${tournament.price_pool} €` },
              { name: "Active Players", value: active.join(", ") },
              {
                name: "Finished Players",
                value: finished.length > 0 ? finished.join(", ") : "None",
              },
              {
                name: "Money Distribution in %",
                value: tournament.buy_ins > 6 ? "60 / 30 / 10" : "70 / 30",
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
