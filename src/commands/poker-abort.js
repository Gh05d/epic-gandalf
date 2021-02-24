const { Tournament } = require("../sequelizeSetup");

module.exports = {
  name: "poker-abort",
  aliases: ["abort", "abort-tournament", "tournament-abort"],
  description: "Aborts a running poker tournament",
  admin: true,
  execute: async message => {
    try {
      const [aborted] = await Tournament.update(
        { status: "aborted" },
        { where: { status: "running" } }
      );

      if (!aborted) {
        return message.reply("sorry, there seems to be no tournament running");
      }

      return message.channel.send("Aborted current Poker Tournament");
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
