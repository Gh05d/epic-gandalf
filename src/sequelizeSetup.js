const Sequelize = require("sequelize");
const { STRING, INTEGER, DATE, BIGINT, ARRAY, ENUM } = Sequelize;
const { DATABASE_PASSWORD, DATABASE_URL, ENVIRONMENT } = process.env;

const sequelize = new Sequelize("poker", "postgres", DATABASE_PASSWORD, {
  host: DATABASE_URL,
  dialect: "postgres",
  logging: ENVIRONMENT == "development" ? console.info : false,
  define: { createdAt: false, updatedAt: false, freezeTableName: true, underscored: true },
});

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const Player = sequelize.define("player_data", {
  id: { type: STRING, primaryKey: true },
  name: STRING(50),
  email: {
    type: STRING(50),
    set(email) {
      if (!email.match(emailRegex)) {
        throw new Error("Not a valid email");
      } else {
        this.setDataValue("email", email);
      }
    },
  },
});

const Tournament = sequelize.define("tournament_data", {
  id: { type: INTEGER, primaryKey: true, autoIncrement: true },
  date: DATE,
  status: ENUM("running", "finished", "aborted"),
});

const PlayerTournament = sequelize.define("player_tournament_data", {
  rebuys: INTEGER,
  position: INTEGER,
  player_id: {
    type: STRING,
    foreignKey: true,
    allowNull: false,
    references: {
      model: "Player",
      key: "id",
    },
  },
  tournament_id: {
    type: INTEGER,
    foreignKey: true,
    allowNull: false,
    references: {
      model: "Player",
      key: "id",
    },
  },
});

PlayerTournament.removeAttribute("id");

const TournamentView = sequelize.define("tournament_view", {
  id: { type: BIGINT, primaryKey: true },
  date: DATE,
  status: STRING(50),
  players: ARRAY(STRING(50)),
  amount_players: BIGINT,
  rebuys: INTEGER,
  buy_ins: INTEGER,
  price_pool: INTEGER,
  winner: STRING(50),
  second: STRING(50),
});

module.exports = { sequelize, Player, Tournament, PlayerTournament, TournamentView };
