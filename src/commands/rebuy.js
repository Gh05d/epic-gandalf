const Path = require("path");
const Discord = require("discord.js");
const { TournamentView, PlayerTournament } = require("../sequelizeSetup");
const { getPlayerID, playSound } = require("../helpers");
const { GANDALF_AUDIO } = require("../constants");

module.exports = {
  name: "rebuy",
  admin: true,
  description: "Adds a rebuy to the tournament",
  async execute(message, players) {
    try {
      if (players.length != 1) {
        return message.reply("you need to specify at least one player. Example: $rebuy [player]");
      }

      const [player] = players;
      const tournament = await TournamentView.findOne({
        where: { status: "running" },
        raw: true,
      });

      if (!tournament) {
        return message.reply("sorry, couldn't find an active tournament");
      }

      const id = getPlayerID(player);

      await PlayerTournament.increment(
        { rebuys: 1 },
        { where: { player_id: id, tournament_id: tournament.id } }
      );

      const attachment = new Discord.MessageAttachment(
        Path.resolve(__dirname, "../../", "assets", "smile.png"),
        "smile.png"
      );

      const start = {
        embed: {
          title: "Re re re re re reeeeeeeeeeebuy",
          description: `${player} has made a rebuy`,
          files: [attachment],
          image: { url: "attachment://smile.png" },
        },
      };

      return await playSound(GANDALF_AUDIO, message, start);
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
