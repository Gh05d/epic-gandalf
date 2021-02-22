const { doppelkinnDommez } = require("../doppelkinnDommez");

module.exports = {
  name: "dommez",
  aliases: ["dommez", "domme", "tobi", "dommes"],
  description: "Generates a nice and fully reasonable excuse for your friends",
  execute: message =>
    message.channel.send({
      embed: {
        color: "#ed0ba5",
        author: {
          name: "Doppelkinn Dommez",
          icon_url:
            "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.OMXJ7SbSztjLmHfTdodXkgAAAA%26pid%3DApi&f=1",
        },
        description: doppelkinnDommez(),
      },
    }),
};
