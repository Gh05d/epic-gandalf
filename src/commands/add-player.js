const Path = require("path");
const Discord = require("discord.js");
const { Player } = require("../sequelizeSetup");
const { client } = require("../constants");

module.exports = {
  name: "add-player",
  aliases: ["new-player", "add"],
  admin: true,
  async execute(message, playerData) {
    if (playerData.length < 4) {
      return message.reply(
        "please set all data. The command should look like this: $add-player [id] [name] [paypal firstname] [paypal lastname]"
      );
    }

    try {
      const [id, name, ...paypalName] = playerData;

      const newPlayer = await Player.create({
        id,
        name,
        paypal_name: paypalName.join(" "),
      });
      client.players.set(id, newPlayer.dataValues);

      const attachment = new Discord.MessageAttachment(
        Path.resolve(__dirname, "../../", "assets", "welcome.jpeg"),
        "welcome.jpeg"
      );

      return await message.channel.send({
        embed: {
          title: "New player registered",
          image: { url: "attachment://welcome.jpeg" },
          files: [attachment],
          footer: { text: `Please welcome ${name}` },
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  },
};
