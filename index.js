const dotenv = require("dotenv");
dotenv.config();

const path = require("path");
const fs = require("fs");
const axios = require("axios");
const Discord = require("discord.js");
const client = new Discord.Client();

const { doppelkinnDommez } = require("./doppelkinnDommez");
const { Player, Tournament, PlayerTournament, TournamentView } = require("./sequelizeSetup");

const PREFIX = "$";
const GANDALF_VIDEO = "https://i.imgur.com/DOVqVvh.mp4";
const GANDALF_AUDIO = path.join("./", "public", "epic_sax_gandalf.webm");
const GANDALF_GIF =
  "https://media1.tenor.com/images/cc7f226783133f6088c33e871a048c2e/tenor.gif?itemid=3551563";
const SERVER_ID = "774649723562098699";
const POKER_CHANNEL_ID = "777166327466950656";

let voiceChannel = null;

client.once("ready", async () => console.log(`Riding on a 🦄 into the 🌇`));

client.login(process.env.GANDALFS_TOKEN);

client.on("message", async message => {
  if (message.author == "bot") {
    return;
  }

  try {
    if (message.content.trim().startsWith(PREFIX)) {
      const [command, ...text] = message.content.trim().substring(PREFIX.length).split(/\s+/g);

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

        case "trump":
        case "tronald":
        case "the_donald":
        case "the-donald":
          const config = { headers: { Accept: "application/hal+json" } };
          const res = await axios.get("https://api.tronalddump.io/random/quote", config);

          if (res && res.status === 200) {
            return await message.channel.send({
              embed: {
                color: "#FAD799",
                author: {
                  name: "Tronald Dump",
                  icon_url:
                    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.explicit.bing.net%2Fth%3Fid%3DOIP.2vvU7DIp0gqvypWO2u3arwHaEK%26pid%3DApi&f=1",
                },
                description: res.data.value,
                footer: {
                  text: `Proudly stated on ${res.data.appeared_at}`,
                },
              },
            });
          } else {
            return message.reply(`sorry, couldn't get a reply from Tronald 😔`);
          }

        case "statistics":
          const tournament = await TournamentView.findOne({
            where: { status: "running", raw: true },
          });
          console.log("\x1b[1m%s\x1b[0m", "LOG tournament", tournament);
          return await message.channel.send({
            embed: {
              title: "Statistics for the current game",
              description: res.data.value,
              footer: {
                text: `Proudly stated on ${res.data.appeared_at}`,
              },
            },
          });

        case "poker":
        case "pokre":
        case "pogre":
          return message.channel.send("Starting Poker Tournament");

        case "end":
          if (voiceChannel) {
            voiceChannel.disconnect();
          }

          return await channel.leave();

        case "epic":
          voiceChannel = await channel.join();

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

          dispatcher.on("finish", () => message.channel.send("Stopped rocking 😔"));

          dispatcher.on("on", error => {
            console.error(error);
            message.reply(
              `sorry, couldn't start to rock 💩 There was this problem: ${error.message}`
            );
          });

          return;

        default:
          message.reply(`whaaaaaaaaazz up`);
      }
    }
  } catch (err) {
    console.error(err);
  }
});
