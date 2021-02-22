const axios = require("axios");

module.exports = {
  name: "tronald",
  aliases: ["trump", "tronald", "the_donald", "the-donald"],
  async execute(message) {
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
            text: `Proudly stated on ${res.data.appeared_at.split("T")[0]}`,
          },
        },
      });
    } else {
      return message.reply(`sorry, couldn't get a reply from Tronald 😔`);
    }
  },
};
