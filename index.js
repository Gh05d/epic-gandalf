const dotenv = require("dotenv");
dotenv.config();

const path = require("path");
const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client();

const { doppelkinnDommez } = require("./doppelkinnDommez");

const PREFIX = "$";
const GANDALF_VIDEO = "https://i.imgur.com/DOVqVvh.mp4";
const GANDALF_AUDIO = path.join("./", "public", "epic_sax_gandalf.webm");
const GANDALF_GIF =
  "https://media1.tenor.com/images/cc7f226783133f6088c33e871a048c2e/tenor.gif?itemid=3551563";
const SERVER_ID = "774649723562098699";
const POKER_CHANNEL_ID = "777166327466950656";

let voiceChannel = null;

client.once("ready", () => console.log(`Riding on a 🦄 into the 🌇`));

client.login(process.env.GANDALFS_TOKEN);

client.on("message", async message => {
  if (message.author == "bot") {
    return;
  }

  try {
    if (message.content.trim().startsWith(PREFIX)) {
      const [command, ...text] = message.content
        .trim()
        .substring(PREFIX.length)
        .split(/\s+/g);

      const channel = await client.channels.cache.get(POKER_CHANNEL_ID);

      switch (command.toLowerCase()) {
        case "dommez":
        case "domme":
        case "tobi":
        case "dommes":
          return message.channel.send({
            embed: {
              color: "#ed0ba5",
              author: {
                name: "Doppelkinn Dommez",
                icon_url:
                  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.OMXJ7SbSztjLmHfTdodXkgAAAA%26pid%3DApi&f=1",
              },
              description: doppelkinnDommez(),
            },
          });

        case "gandalf":
          return await message.channel.send({
            embed: {
              image: {
                url: GANDALF_GIF,
              },
            },
          });

        case "repeat":
          return message.reply(`Why did you say: ${text}?`);

        case "players":
          return channel.send("Starting Poker Tournament");

        case "poker":
        case "pokre":
          voiceChannel = await channel.join();
          return;

        case "end":
          if (voiceChannel) {
            voiceChannel.disconnect();
          }

          return await channel.leave();

        case "epic":
          if (!voiceChannel) {
            voiceChannel = await channel.join();
          }

          const dispatcher = voiceChannel.play(
            fs.createReadStream(GANDALF_AUDIO, { type: "webm/opus" })
          );

          dispatcher.on(
            "start",
            async () =>
              await message.channel.send({
                embed: {
                  title: "Startin to rock 🎸",
                  image: {
                    url: GANDALF_GIF,
                  },
                },
              })
          );
          dispatcher.on("finish", () =>
            message.channel.send("Stopped rocking 😔")
          );
          dispatcher.on("on", console.error);

          return;

        default:
          message.reply(`whaaaaaaaaazz up`);
      }
    }
  } catch (err) {
    console.error(err);
  }
});
