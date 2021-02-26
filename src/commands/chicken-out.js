const { PlayerTournament, Tournament } = require("../sequelizeSetup");
const { getPlayer } = require("../helpers");

module.exports = {
  name: "chicken-out",
  description: "Removes a player from the running tournament",
  admin: true,
  async execute(message, [playerName]) {
    if (!playerName) {
      return message.reply(
        "please set all data. The command should look like this: $chicken-out [name]"
      );
    }

    try {
      const tournament = await Tournament.findOne({
        where: { status: "running" },
        raw: true,
      });
      const player = getPlayer(playerName);

      if (!tournament) {
        return message.reply("there is no running tournament");
      }

      const removed = await PlayerTournament.destroy({
        where: { player_id: player.id, tournament_id: tournament.id },
      });

      if (removed != 1) {
        throw new Error("couldn't remove player");
      }

      return await message.channel.send({
        embed: {
          title: "Player removed from tournament 😢",
          description: `Removed player ${playerName} from the current tournament`,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  },
};
