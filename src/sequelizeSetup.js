const Sequelize = require("sequelize");
const { STRING, INTEGER, DATE, BIGINT, ARRAY, ENUM, BOOLEAN } = Sequelize;
const {
	DATABASE_PASSWORD,
	DATABASE_URL,
	LOCAL_DATABASE,
	DEBUG_DATABASE = "",
	ENVIRONMENT,
} = process.env;

let sequelize;

const define = {
	createdAt: false,
	updatedAt: false,
	freezeTableName: true,
	underscored: true,
};

// if (ENVIRONMENT == "development") {
//   sequelize = new Sequelize(
//     ENVIRONMENT == "development" ? "poker_development" : "poker",
//     "postgres",
//     DATABASE_PASSWORD,
//     {
//       host: LOCAL_DATABASE,
//       dialect: "postgres",
//       logging: DEBUG_DATABASE.toLowerCase() != "false" ? console.info : false,
//       define,
//     }
//   );
// } else {
//   sequelize = new Sequelize(DATABASE_URL, {
//     dialect: "postgres",
//     dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
//     protocol: "postgres",
//     port: "5432",
//     logging: false,
//     define,
//   });
// }

sequelize = new Sequelize(
	ENVIRONMENT == "development" ? "poker_development" : "poker",
	"postgres",
	DATABASE_PASSWORD,
	{
		host: LOCAL_DATABASE,
		dialect: "postgres",
		logging: DEBUG_DATABASE.toLowerCase() != "false" ? console.info : false,
		define,
	}
);

const Player = sequelize.define("player_data", {
	id: { type: STRING, primaryKey: true },
	name: STRING(50),
	paypal_name: STRING(100),
	admin: { type: BOOLEAN, defaultValue: false },
});

const Tournament = sequelize.define("tournament_data", {
	id: { type: BIGINT, primaryKey: true, autoIncrement: true },
	date: DATE,
	status: ENUM("running", "finished", "aborted"),
});

const PlayerTournament = sequelize.define("player_tournament_data", {
	rebuys: INTEGER,
	position: { type: INTEGER, defaultValue: 0 },
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

module.exports = {
	sequelize,
	Player,
	Tournament,
	PlayerTournament,
	TournamentView,
};
