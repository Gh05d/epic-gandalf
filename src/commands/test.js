const { pollingStart, pollingEnd } = require("../google");

module.exports = {
  name: "poll",
  async execute(message, [arg]) {
    if (arg == "start") {
      pollingStart();

      return message.reply("Started polling");
    } else if (arg == "end" || arg == "stop") {
      pollingEnd();
      return message.reply("Stopped polling");
    } else {
      message.reply("Specify start or end");
    }
  },
};
