const { Player } = require("../sequelizeSetup");
const { getPlayer } = require("../helpers");
const { client } = require("../constants");

module.exports = {
  name: "update-player-paypal",
  description: "Update the paypal name of a player",
  admin: true,
  async execute(message, args) {
    if (args.length < 3) {
      return message.reply(
        "please set all data. The command should look like this: $update-player-paypal [name] [firstname] [lastname]"
      );
    }

    const [name, ...paypalName] = args;

    try {
      const player = getPlayer(name);
      const paypal_name = paypalName.join(" ");

      await Player.update({ paypal_name }, { where: { id: player.id } });

      const newPlayer = { ...player, paypal_name };

      client.players.set(player.id, newPlayer);

      return await message.channel.send({
        embed: {
          title: `Updated ${name}`,
          description: `Set his paypal name to ${paypal_name}`,
        },
      });
    } catch (error) {
      console.log("\x1b[1m%s\x1b[0m", "LOG error", error);
      throw new Error(error);
    }
  },
};
