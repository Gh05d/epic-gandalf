const { Player, PlayerTournament, sequelize } = require("../sequelizeSetup");
const { client } = require("../constants");
const { getPlayer } = require("../helpers");

module.exports = {
  name: "remove-player",
  aliases: ["delete-player", "delete"],
  admin: true,
  async execute(message, [playerName]) {
    if (!playerName) {
      return message.reply(
        "please set all data. The command should look like this: $remove-player [name]"
      );
    }

    const player = getPlayer(playerName);

    try {
      await sequelize.transaction(async ta => {
        try {
          await PlayerTournament.destroy({
            where: { player_id: player.id },
            transaction: ta,
          });

          const removed = await Player.destroy({
            where: { id: player.id },
            transaction: ta,
          });

          if (removed != 1) {
            throw new Error("couldn't remove player");
          }
          client.players = client.players.filter((_v, key) => key != player.id);
        } catch (error) {
          throw new Error(error);
        }
      });

      return await message.channel.send({
        embed: {
          title: "Player removed",
          description: `Removed player ${playerName}`,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  },
};
