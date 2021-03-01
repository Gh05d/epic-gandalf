const { manualAuthorization, sendToken } = require("../authorize-google");

module.exports = {
  name: "authorize-google",
  admin: true,
  execute: async (_message, [code]) => {
    try {
      if (!code) {
        await manualAuthorization();
      } else {
        await sendToken(code);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
