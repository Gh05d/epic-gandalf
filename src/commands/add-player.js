const Path = require("path");
const Discord = require("discord.js");
const { Player } = require("../sequelizeSetup");
const { client } = require("../constants");

module.exports = {
  name: "add-player",
  aliases: ["new-player", "add"],
  admin: true,
  async execute(message, playerData) {
    if (playerData.length < 3) {
      return message.reply(
        "please set all data. The command should look like this: $add-player [id] [name] [email]"
      );
    }

    try {
      const [id, name, email] = playerData;

      const newPlayer = await Player.create({ id, name, email });
      client.players.push(newPlayer.dataValues);

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
      console.log("\x1b[1m%s\x1b[0m", "LOG error", error);
      throw new Error(error);
    }
  },
};
