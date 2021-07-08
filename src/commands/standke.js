const Path = require("path");

module.exports = {
	name: "standke",
	description: "Epic dance video of Failix",
	aliases: ["felix", "failix"],
	execute: async message => {
		return message.channel.send({
			embed: {
				title: "Epic Failix 🕺",
				color: "#ffc0cb",
				description: "Dance dance dance",
				files: [Path.resolve(__dirname, "..", "..", "assets", "standke.gif")],
				image: { url: "attachment://standke.gif" },
			},
		});
	},
};
