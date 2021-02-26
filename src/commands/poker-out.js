const { PlayerTournament, TournamentView } = require("../sequelizeSetup");
const { getPlayer } = require("../helpers");

module.exports = {
  name: "poker-out",
  aliases: ["tournament-out"],
  description: "Sets the players position when he has finished the tournament",
  admin: true,
  async execute(message, [name]) {
    if (!name) {
      return message.reply(
        "please set all data. The command should look like this: $poker-out [name]"
      );
    }

    try {
      const player = getPlayer(name);
      const tournament = await TournamentView.findOne({
        where: { status: "running" },
        raw: true,
      });

      if (!tournament) {
        return message.reply("there is no running tournament");
      }

      const participant = tournament.players.find(
        playerName => playerName == name
      );

      if (!participant) {
        return message.reply(
          `couldn't find player ${name} in the current tournament. Use $info to see which players are in it.`
        );
      }

      const positions = await PlayerTournament.findAll({
        where: { tournament_id: tournament.id },
        raw: true,
      });
      const alreadyFinished = positions.find(
        entry => entry.position && entry.player_id == player.id
      );

      if (alreadyFinished) {
        return message.reply(
          `Player ${name} has already finished the tournament on position ${alreadyFinished.position}`
        );
      }

      const lowestPosition = positions.reduce((acc, cV) => {
        if (acc === 0) {
          return cV.position;
        } else {
          return acc < cV.position ? acc : cV.position;
        }
      }, 0);

      const position = lowestPosition ? lowestPosition - 1 : positions.length;

      const [set] = await PlayerTournament.update(
        { position },
        { where: { player_id: player.id, tournament_id: tournament.id } }
      );

      if (set != 1) {
        throw new Error("sorry, couldn't update players position");
      }

      return await message.channel.send({
        embed: {
          title: `${name} has finished the tournament 😢`,
          description: `Player ${name} has finished the tournament on position ${position}`,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  },
};
