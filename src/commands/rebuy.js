const Path = require("path");
const Discord = require("discord.js");
const { TournamentView, PlayerTournament } = require("../sequelizeSetup");
const { getPlayer, playSound } = require("../helpers");
const { GANDALF_AUDIO } = require("../constants");

module.exports = {
	name: "rebuy",
	admin: true,
	description: "Adds a rebuy to the tournament",
	async execute(message, [player]) {
		try {
			if (!player) {
				return message.reply("you need to specify a player. Example: $rebuy [player]");
			}

			const tournament = await TournamentView.findOne({
				where: { status: "running" },
				raw: true,
			});

			if (!tournament) {
				return message.reply("sorry, couldn't find an active tournament");
			}

			const { id } = getPlayer(player);

			const [[, inTournament]] = await PlayerTournament.increment(
				{ rebuys: 1 },
				{ where: { player_id: id, tournament_id: tournament.id } }
			);

			if (!inTournament) {
				return message.reply(`${player} is not in the tournament!`);
			}

			const image = player == "bassi" ? "bassi.jpeg" : "smile.png";

			const attachment = new Discord.MessageAttachment(
				Path.resolve(__dirname, "../../", "assets", image)
			);

			const start = {
				embed: {
					title: "Re re re re re reeeeeeeeeeebuy",
					description: `Rebuy ${player}`,
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
