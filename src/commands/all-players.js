const { client } = require("../constants");

module.exports = {
  name: "all-players",
  description: "Posts the names of all players",
  aliases: ["players"],
  async execute(message) {
    message.channel.send({
      embed: {
        title: "All players",
        description: client.players.map(({ name }) => name).join("\n"),
      },
    });
  },
};
