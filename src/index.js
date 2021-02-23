const dotenv = require("dotenv");
dotenv.config();

const Fs = require("fs");
const Path = require("path");

const { Player } = require("./sequelizeSetup");
const { client } = require("./constants.js");

const commandFiles = Fs.readdirSync(Path.resolve(__dirname, "commands")).filter(file =>
  file.endsWith(".js")
);
console.log("\x1b[1m%s\x1b[0m", "LOG commandFiles", commandFiles);
for (const file of commandFiles) {
  const command = require(Path.resolve(__dirname, "commands", file));

  client.commands.set(command.name, command);
}

const PREFIX = "$";

client.once("ready", async () => {
  console.log("Querying players");
  const players = await Player.findAll({ raw: true });
  client.players = players;
  console.log(`Riding on a 🦄 into the 🌇`);
});

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
        const { admin } = client.players.find(player => player.id == message.author.id);

        if (command.admin && !admin) {
          throw new Error("you have to be an admin to do this!");
        }

        return await command.execute(message, args);
      }
    }
  } catch (err) {
    console.error(err);
    return message.reply(`sorry, I couldn't execute the command 😭 ${err.message}`);
  }
});
