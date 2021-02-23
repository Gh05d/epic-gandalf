const { Tournament } = require("../sequelizeSetup");

module.exports = {
  name: "poker-abort",
  aliases: ["abort", "abort-tournament"],
  description: "Aborts a running poker tournament",
  admin: true,
  execute: async message => {
    try {
      const [aborted] = await Tournament.update(
        { status: "aborted" },
        { where: { status: "running" } }
      );
      console.log("FIRE ~ file: poker-abort.js ~ line 14 ~ aborted", aborted);

      if (!aborted) {
        return message.reply("sorry, there seems to be no tournament running");
      }

      return message.channel.send("Aborted current Poker Tournament");
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
