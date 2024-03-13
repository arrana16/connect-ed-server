import express from "express";
import {
	getGames,
	getSports,
	getStandings,
	setGames,
	updateGamesStandings,
} from "./database.js";
import cron from "node-cron";

const app = express();
const port = 8080;

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

app.get("/sports", async (req, res) => {
	try {
		const sports = await getSports();
		res.status(200).json({ data: sports });
	} catch (err) {
		res.status(500).json({ error: err });
	}
});

app.get("/standings/:leagueNum", async (req, res) => {
	try {
		const standings = await getStandings(req.params.leagueNum);
		res.status(200).json({ data: standings });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err });
	}
});

app.get("/games/:leagueNum", async (req, res) => {
	try {
		const games = await getGames(req.params.leagueNum);
		res.status(200).json({ data: games });
	} catch (err) {
		res.status(500).json({ error: err });
	}
});

cron.schedule("*/20 * * * *", updateGamesStandings);

cron.schedule("0 0 1 * *", setGames);
