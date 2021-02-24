const { pollingStart, pollingEnd } = require("../google");

module.exports = {
  name: "test",
  async execute(message, [arg]) {
    if (arg == "start") {
      pollingStart();

      return message.reply("Started polling");
    } else if (arg == "end") {
      pollingEnd();
      return message.reply("Stopped polling");
    } else {
      message.reply("Specify start or end");
    }
  },
};
