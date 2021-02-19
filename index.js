const dotenv = require("dotenv");
dotenv.config();

const Fs = require("fs");
const Path = require("path");

const { Player, Tournament, PlayerTournament, TournamentView } = require("./sequelizeSetup");
const { client } = require("./constants.js");

const commandFiles = Fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(Path.resolve("./", "commands", file));

  client.commands.set(command.name, command);
}

const PREFIX = "$";

client.once("ready", async () => console.log(`Riding on a 🦄 into the 🌇`));

client.login(process.env.GANDALFS_TOKEN);

client.on("message", async message => {
  if (message.author == "bot") {
    return;
  }

  try {
    if (message.content.trim().startsWith(PREFIX)) {
      const [commandName, ...args] = message.content.trim().substring(PREFIX.length).split(/\s+/g);
      const normalizedCommandName = commandName.toLowerCase();

      const command =
        client.commands.get(normalizedCommandName) ||
        client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(normalizedCommandName));

      if (!command) {
        return message.reply(`whaaaaaaaaazz up`);
      } else {
        return command.execute(message, args);
      }
    }
  } catch (err) {
    console.error(err);
    return message.reply("sorry, I couldn't execute the command 😭");
  }
});
