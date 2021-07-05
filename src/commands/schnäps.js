const Path = require("path");
const { playSound } = require("../helpers");

module.exports = {
	name: "schnäps",
	description: "Desperate for shots",
	aliases: ["schnaps", "schnappes", "schnaeps"],
	execute: async message =>
		await playSound(Path.resolve(__dirname, "../..", "assets", "schnaeps.webm"), message),
};
