const { TournamentView } = require("../sequelizeSetup");

module.exports = {
  name: "statistics",
  async execute(message) {
    const tournament = await TournamentView.findOne({
      where: { status: "running", raw: true },
    });

    console.log("\x1b[1m%s\x1b[0m", "LOG tournament", tournament);

    return await message.channel.send({
      embed: {
        title: "Statistics for the current game",
        description: res.data.value,
        footer: {
          text: `Proudly stated on ${res.data.appeared_at}`,
        },
      },
    });
  },
};
