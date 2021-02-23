const { Player, PlayerTournament } = require("../sequelizeSetup");
const { client } = require("../constants");
const { getPlayerID } = require("../helpers");

module.exports = {
  name: "remove-player",
  aliases: ["delete-player", "delete"],
  admin: true,
  async execute(message, playerName) {
    if (playerName.length < 1) {
      return message.reply(
        "please set all data. The command should look like this: $remove-player [id] [name] [email]"
      );
    }

    const playerID = getPlayerID(playerName[0]);

    try {
      await PlayerTournament.destroy({ where: { id: playerID } });
      const removed = await Player.destroy({ where: { id: playerID } });

      if (removed != 1) {
        throw new Error("couldn't remove player");
      }
      client.players = client.players.filter(player => player.id != playerID);

      return await message.channel.send({
        embed: { title: "Player removed", description: `Removed player ${playerName}` },
      });
    } catch (error) {
      console.log("\x1b[1m%s\x1b[0m", "LOG error", error);
      throw new Error(error);
    }
  },
};
