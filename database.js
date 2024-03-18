import mysql from "mysql2";
import { parseSports, parseStandings, parseGames } from "./games.js";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql
	.createPool({
		host: process.env.HOST,
		user: process.env.DB_USERNAME,
		password: process.env.PASSWORD,
		database: process.env.DATABASE,
		port: process.env.DBPORT,
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
	try {
		const result = await pool.query(
			"INSERT INTO Standings(sport_id, school_id, wins, losses, ties, points, table_num, standings_code) VALUES ? ON DUPLICATE KEY UPDATE wins = VALUES(wins), losses = VALUES(losses), ties = VALUES(ties), points = VALUES(points);",
			[formattedStandings]
		);
		return result;
	} catch (err) {
		console.log(err);
	}
}

export async function setGames(leagueCode) {
	const games = await parseGames(leagueCode);
	const formattedGames = gamesConvert(games);
	try {
		const result = await pool.query(
			"INSERT INTO Games(sport_id, home_id, away_id, home_score, away_score, game_date, game_time, location, game_code) VALUES ? ON DUPLICATE KEY UPDATE home_score = VALUES(home_score), away_score = VALUES(away_score);",
			[formattedGames]
		);
		return result;
	} catch (err) {
		console.log(err);
	}
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
	const result = await pool.query("SELECT * FROM Sports;");
	return result[0];
}

export async function getStandings(leagueNum) {
	const result = await pool.query(
		"SELECT table_num, school_id, wins, losses, ties, points, school_name, abbreviation, logo_dir FROM Standings INNER JOIN Sports ON Standings.sport_id = Sports.id INNER JOIN Schools ON school_id = Schools.id WHERE Sports.league_code = ?;",
		[leagueNum]
	);
	return result[0];
}

export async function getGames(leagueNum) {
	const result = await pool.query(
		`SELECT G.home_id, SH.school_name, SH.abbreviation, SH.logo_dir,
				G.away_id, SA.school_name, SA.abbreviation, SA.logo_dir,
				G.home_score, G.away_score, G.highlights_url,
				G.game_time, G.game_code, G.location, G.game_date
		FROM Games G
		INNER JOIN Sports S ON G.sport_id = S.id
		INNER JOIN Schools SH ON G.home_id = SH.id
		INNER JOIN Schools SA ON G.away_id = SA.id
		WHERE Sports.league_code = ?;`,
		[leagueNum]
	);
	return result[0];
}

export async function getAllGames() {
	const result = await pool.query(
		`SELECT G.home_id, SH.school_name, SH.abbreviation, SH.logo_dir,
				G.away_id, SA.school_name, SA.abbreviation, SA.logo_dir,
				G.home_score, G.away_score, G.highlights_url,
				G.game_time, G.game_code, G.location, G.game_date
		FROM Games G
		INNER JOIN Sports S ON G.sport_id = S.id
		INNER JOIN Schools SH ON G.home_id = SH.id
		INNER JOIN Schools SA ON G.away_id = SA.id;`
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

export async function updateGamesStandings() {
	console.log("Updating games and standings");
	const sports = await getSports();
	const today = new Date();
	const season = getSeason(today);
	let filteredSports;
	if (season != "Unknown") {
		filteredSports = sports.filter((sport) => sport.term === season);
	} else {
		filteredSports = sports;
	}

	const gamePromises = filteredSports.map(async (sport) => {
		const games = await setGames(sport.league_code);
		return games;
	});

	const standingsPromises = filteredSports.map(async (sport) => {
		const standings = await setStandings(sport.league_code);
		return standings;
	});
	await Promise.all(gamePromises);
	await Promise.all(standingsPromises);

	console.log("Games and standings updated");
}

function getSeason(date) {
	const month = date.getMonth();
	const day = date.getDate();
	let season;

	switch (month) {
		case 8: // September
		case 9: // October
			season = "Fall";
			break;
		case 10: // November
			if (day >= 10) {
				season = "Winter";
			} else {
				season = "Fall";
			}
			break;
		case 11: // December
		case 0: // January
		case 1: // February
			season = "Winter";
			break;
		case 2: // March
			if (day >= 10) {
				season = "Spring";
			} else {
				season = "Winter";
			}
			break;
		case 3: // April
		case 4: // May
			season = "Spring";
			break;
		default:
			season = "Unknown";
			break;
	}

	return season;
}
