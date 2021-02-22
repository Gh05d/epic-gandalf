const { players } = require("./constants");

module.exports = {
  getPlayerID: player => {
    const player_id = players[player];

    if (!player_id) {
      throw new Error(`Couldn't find ${player}`);
    }

    return player_id;
  },
};
