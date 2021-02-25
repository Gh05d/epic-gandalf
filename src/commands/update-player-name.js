const { Player } = require("../sequelizeSetup");
const { getPlayer } = require("../helpers");
const { client } = require("../constants");

module.exports = {
  name: "update-player-name",
  aliases: ["edit-player-name"],
  description: "You can update name and email here",
  admin: true,
  async execute(message, args) {
    if (args.length < 2) {
      return message.reply(
        "please set all data. The command should look like this: $update-player [name] [newName]"
      );
    }

    const [name, newName] = args;

    try {
      const player = getPlayer(name);

      await Player.update({ name: newName }, { where: { id: player.id } });

      const newPlayer = { ...player, name: newName };

      client.players.set(player.id, newPlayer);

      return await message.channel.send({
        embed: {
          title: `Updated ${name}`,
          description: `His name changed from ${name} to ${newName}`,
        },
      });
    } catch (error) {
      console.log("\x1b[1m%s\x1b[0m", "LOG error", error);
      throw new Error(error);
    }
  },
};
