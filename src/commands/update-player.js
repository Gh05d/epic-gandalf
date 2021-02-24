const { Player } = require("../sequelizeSetup");
const { getPlayer } = require("../helpers");
const { client } = require("../constants");

module.exports = {
  name: "update-player",
  aliases: ["edit-player"],
  description: "You can update name and email here",
  admin: true,
  async execute(message, args) {
    if (args.length != 3) {
      return message.reply(
        "please set all data. The command should look like this: $update-player [name] [field] [herbert]"
      );
    }

    const [name, field, value] = args;

    try {
      const player = getPlayer(name);

      if (field == "email" || field == "name") {
        const [, [updatedPlayer]] = await Player.update(
          { [field]: value },
          { where: { id: player.id }, returning: true }
        );

        const newPlayer = { ...player, [field]: value };

        client.players.set(player.id, newPlayer);

        return await message.channel.send({
          embed: {
            title: `Updated ${name}`,
            description: `His ${field} changed from ${player.name} to ${updatedPlayer.dataValues[field]}`,
          },
        });
      } else {
        return message.reply("🗯️ you can only update name or email!");
      }
    } catch (error) {
      console.log("\x1b[1m%s\x1b[0m", "LOG error", error);
      throw new Error(error);
    }
  },
};
