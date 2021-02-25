const { signupPlayers } = require("../helpers");
const { Tournament } = require("../sequelizeSetup");

module.exports = {
  name: "buyin",
  aliases: ["buy-in"],
  admin: true,
  description: "Lets players buyin to a running tournament",
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
      await signupPlayers(tournament.id, players);

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
