import axios from "axios";
import cheerio from "cheerio";
import qs from "qs";

import { getSchoolIDAbbrev, getSchoolIDName, getSportID } from "./database.js";

export async function inSport(leagueNum, name) {
	const response = await axios
		.request({
			baseURL: "http://www.cisaa.ca/cisaa/ShowPage.dcisaa?CISAA_Results",
			method: "PUT",
			headers: { "content-type": "application/x-www-form-urlencoded" },
			data: qs.stringify({ txtleague: `${leagueNum}` }),
		})
		.catch((err) => {
			return false;
		});

	const html = response.data;
	const $ = cheerio.load(html);
	var insport = false;

	$("#standings").each((index, element) => {
		$(element)
			.find("div>table>tbody>tr")
			.each((index, element) => {
				if ($(element).text() != "TeamsGamesWinLossTiePoints") {
					let text = $(element).text();
					let teamName = "";
					let counter = 0;
					while (
						counter < text.length &&
						text.charAt(counter) != "-"
					) {
						teamName += text.charAt(counter);
						counter++;
					}
					//console.log(teamName);
					teamName = teamName.substring(0, teamName.length - 2);
					if (teamName == "Appleby College") {
						insport = true;
					}
				}
			});
	});

	return insport;
}

export async function parseSports() {
	let sports = [];
	const response = await axios.request({
		baseURL: "http://www.cisaa.ca/cisaa/ShowPage.dcisaa?CISAA_Results",
		method: "PUT",
		headers: { "content-type": "application/x-www-form-urlencoded" },
		data: { txtleague: "2860Y8N5D" },
	});

	const html = response.data;
	const $ = cheerio.load(html);

	const fallPromises = $("#lstFall option").map(async (index, element) => {
		try {
			if (
				(await inSport($(element).val(), $(element).text())) &&
				$(element).text() != "FALL"
			) {
				return [$(element).text(), "Fall", $(element).val()];
			}
		} catch (err) {}
	});

	const winterPromises = $("#lstWinter option").map(
		async (index, element) => {
			try {
				if (
					(await inSport($(element).val(), $(element).text())) &&
					$(element).text() != "WINTER"
				) {
					return [$(element).text(), "Winter", $(element).val()];
				}
			} catch (err) {}
		}
	);

	const springPromises = $("#lstSpring option").map(
		async (index, element) => {
			try {
				if (
					(await inSport($(element).val(), $(element).text())) &&
					$(element).text() != "SPRING"
				) {
					return [$(element).text(), "Spring", $(element).val()];
				}
			} catch (err) {}
		}
	);

	// Wait for all promises to resolve
	const fallSports = await Promise.all(fallPromises);
	const winterSports = await Promise.all(winterPromises);
	const springSports = await Promise.all(springPromises);

	// Filter out any undefined values
	sports = [...fallSports, ...winterSports, ...springSports].filter(Boolean);

	// Return the list of sports
	return sports;
}

export async function parseStandings(leagueNum) {
	const response = await axios.request({
		baseURL: "http://www.cisaa.ca/cisaa/ShowPage.dcisaa?CISAA_Results",
		method: "PUT",
		headers: { "content-type": "application/x-www-form-urlencoded" },
		data: qs.stringify({ txtleague: `${leagueNum}` }),
	});

	const html = response.data;
	const $ = cheerio.load(html);

	const sportID = await getSportID(leagueNum);
	let tableNum = 0;
	const standingPromises1 = $("#standingsTable1")
		.find("tr")
		.map(async (index, element) => {
			let rawName = $(element).find(".col1").text().trim();
			let teamName = "";
			let counter = 0;
			while (counter < rawName.length && rawName.charAt(counter) != "-") {
				teamName += rawName.charAt(counter);
				counter++;
			}
			teamName = teamName.substring(0, teamName.length - 2);
			const games_played = parseInt(
				$(element).find(".col2").text().trim()
			);
			const wins = parseInt($(element).find(".col3").text().trim());
			const losses = parseInt($(element).find(".col4").text().trim());
			const ties = parseInt($(element).find(".col5").text().trim());
			const points = parseInt($(element).find(".col6").text().trim());

			const schoolID = await getSchoolIDName(teamName);
			const standings_code = `S_${schoolID}_${sportID}`;
			return {
				team_name: teamName,
				games_played: games_played,
				wins: wins,
				ties: ties,
				losses: losses,
				points: points,
				table_num: 1,
				sport_id: sportID,
				school_id: schoolID,
				standings_code: standings_code,
			};
		})
		.get();

	const standingPromises2 = $("#standingsTable2")
		.find("tr")
		.map(async (index, element) => {
			let rawName = $(element).find(".col1").text().trim();
			let teamName = "";
			let counter = 0;
			while (counter < rawName.length && rawName.charAt(counter) != "-") {
				teamName += rawName.charAt(counter);
				counter++;
			}
			teamName = teamName.substring(0, teamName.length - 2);
			const games_played = parseInt(
				$(element).find(".col2").text().trim()
			);
			const wins = parseInt($(element).find(".col3").text().trim());
			const losses = parseInt($(element).find(".col4").text().trim());
			const ties = parseInt($(element).find(".col5").text().trim());
			const points = parseInt($(element).find(".col6").text().trim());

			const schoolID = await getSchoolIDName(teamName);
			const standings_code = `S_${schoolID}_${sportID}`;
			return {
				team_name: teamName,
				games_played: games_played,
				wins: wins,
				ties: ties,
				losses: losses,
				points: points,
				table_num: 2,
				sport_id: sportID,
				school_id: schoolID,
				standings_code: standings_code,
			};
		})
		.get();

	let standings = await Promise.all(standingPromises1);
	const standings2 = await Promise.all(standingPromises2);

	standings2.forEach((element) => {
		standings.push(element);
	});
	// console.log(standings);
	const filteredStandings = standings.filter((item) => item !== undefined);
	console.log(filteredStandings);
	return filteredStandings;
}

export async function parseGames(leagueNum) {
	const response = await axios.request({
		baseURL: "http://www.cisaa.ca/cisaa/ShowPage.dcisaa?CISAA_Results",
		method: "PUT",
		headers: { "content-type": "application/x-www-form-urlencoded" },
		data: qs.stringify({ txtleague: `${leagueNum}` }),
	});

	const html = response.data;
	const $ = cheerio.load(html);

	const sport_id = await getSportID(leagueNum);

	const gamePromises = $("#scheduleTable tr")
		.map(async (index, element) => {
			const $tdElements = $(element).find("td");
			const date = $tdElements.eq(0).text().trim().substring(4, 10);
			let time = $tdElements.eq(1).text().trim();

			time.substring(6, 7) == "a"
				? (time = time.substring(0, 6) + "AM")
				: (time = time.substring(0, 6) + "PM");

			time.substring(0, 1) == "0"
				? (time = time.substring(1, 8))
				: (time = time.substring(0, 8));

			let home = $tdElements.eq(2).text().trim();
			home = home.substring(0, home.length - 1);

			const homeScore = $tdElements.eq(3).text().trim();

			let away = $tdElements.eq(4).text().trim(); // Index 4 corresponds to the fifth <td>
			away = away.substring(0, away.length - 1);

			const awayScore = $tdElements.eq(5).text().trim();
			if (home == "AC" || away == "AC") {
				let home_id = await getSchoolIDAbbrev(home);
				// console.log(home_id);
				let away_id = await getSchoolIDAbbrev(away);
				const game_code = `G_${sport_id}_${home_id}_${away_id}_${date}`;
				return {
					home_id: home_id,
					away_id: away_id,
					sport_id: sport_id,
					home_score: homeScore,
					away_score: awayScore,
					date: date,
					time: time,
					game_code: game_code,
				};
			}
		})
		.get();

	const games = await Promise.all(gamePromises);
	const filteredGames = games.filter((item) => item !== undefined);
	return filteredGames;
}
