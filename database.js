import mysql from "mysql2";
import { parseSports, parseStandings, parseGames } from "./games.js";

const pool = mysql
	.createPool({
		host: "db-mysql-nyc1-07436-do-user-14766812-0.c.db.ondigitalocean.com",
		user: "doadmin",
		password: "AVNS_DgnObeixSssUi4MPE90",
		database: "defaultdb",
	})
	.promise();

export async function setSports() {
	const sports = await parseSports();
	const result = await pool.query(
		"INSERT IGNORE INTO Sports(name, term, league_code) VALUES ?;",
		[sports]
	);
}

export async function setStandings(leagueCode) {
	const standings = await parseStandings(leagueCode);
	const formattedStandings = standingsConvert(standings);

	const result = await pool.query(
		`INSERT INTO Standings(sport_id, school_id, wins, losses, ties, points, table_num, standings_code) VALUES ? 
		ON DUPLICATE KEY UPDATE wins = VALUES(wins), losses = VALUES(losses), ties = VALUES(ties), points = VALUES(points);`,
		[formattedStandings]
	);
}

export async function setGames(leagueCode) {
	const games = await parseGames(leagueCode);
	const formattedGames = gamesConvert(games);
	console.log(formattedGames);
	const result = await pool.query(
		`INSERT IGNORE INTO Games(sport_id, home_id, away_id, home_score, away_score, game_date, game_time, location, game_code) VALUES ?
		ON DUPLICATE KEY UPDATE home_score = VALUES(home_score), away_score = VALUES(away_score);
		`,
		[formattedGames]
	);
}

export async function getSportID(leagueCode) {
	const result = await pool.query(
		"SELECT id FROM Sports WHERE league_code = ?;",
		[leagueCode]
	);
	return result[0][0]?.id;
}

export async function getSchoolIDName(schoolName) {
	const result = await pool.query(
		"SELECT id FROM Schools WHERE school_name = ?;",
		[schoolName]
	);
	return result[0][0]?.id;
}

export async function getSchoolIDAbbrev(schoolAbbrev) {
	const [result] = await pool.query(
		"SELECT id FROM Schools WHERE abbreviation = ?;",
		schoolAbbrev
	);
	return result[0]?.id;
}

export async function getSports() {
	console.log("getting sports");
	const result = await pool.query("SELECT * FROM Sports;");
	return result[0];
}

export async function getStandings(leagueNum) {
	const result = await pool.query(
		"SELECT table_num, school_id, wins, losses, ties, points FROM Standings INNER JOIN Sports ON Standings.sport_id = Sports.id WHERE Sports.league_code = ?;",
		[leagueNum]
	);
	return result[0];
}

export async function getGames(leagueNum) {
	const result = await pool.query(
		"SELECT home_id, away_id, home_score, away_score, highlights_url, game_time, game_code, location, game_date FROM Games INNER JOIN Sports ON Games.sport_id = Sports.id WHERE Sports.league_code = ?;",
		[leagueNum]
	);
	return result[0];
}

function standingsConvert(standings) {
	const result = [];
	let sport_id,
		school_id,
		wins,
		losses,
		ties,
		points,
		table_num,
		standings_code;
	for (let i = 0; i < standings.length; i++) {
		sport_id = standings[i].sport_id;
		school_id = standings[i].school_id;
		wins = standings[i].wins;
		losses = standings[i].losses;
		ties = standings[i].ties;
		points = standings[i].points;
		table_num = standings[i].table_num;
		standings_code = `S_${school_id}_${sport_id}`;

		result.push([
			sport_id,
			school_id,
			wins,
			losses,
			ties,
			points,
			table_num,
			standings_code,
		]);
	}

	return result;
}

function gamesConvert(games) {
	const result = [];
	let sport_id,
		home_id,
		away_id,
		home_score,
		away_score,
		date,
		time,
		location,
		game_code;
	for (let i = 0; i < games.length; i++) {
		sport_id = games[i].sport_id;
		home_id = games[i].home_id;
		away_id = games[i].away_id;
		home_score = games[i].home_score;
		away_score = games[i].away_score;
		date = games[i].date;
		time = games[i].time;
		location = games[i].location;
		game_code = games[i].game_code;

		result.push([
			sport_id,
			home_id,
			away_id,
			home_score,
			away_score,
			date,
			time,
			location,
			game_code,
		]);
	}

	return result;
}
