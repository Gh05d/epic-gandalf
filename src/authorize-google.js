const Fs = require("fs");
const { authorize } = require("./google");

(function () {
  // Load client secrets from a local file.
  Fs.readFile("google-credentials.json", (err, content) => {
    if (err) {
      return console.log("Error loading client secret file:", err);
    }
    // Authorize a client with credentials, then call the Gmail API.
    authorize(JSON.parse(content), () => {});
  });
})();
