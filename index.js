import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import {
	getAllGames,
	getGames,
	getSports,
	getStandings,
	setGames,
	updateGamesStandings,
	getAllStandings,
} from "./database.js";
import cron from "node-cron";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const app = express();
const port = process.env.PORT;

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

app.get("/standings", async (req, res) => {
	try {
		const standings = await getAllStandings();
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

app.get("/games", async (req, res) => {
	try {
		const games = await getAllGames();
		res.status(200).json({ data: games });
	} catch (err) {
		res.status(500).json({ error: err });
	}
});

app.get("/privacy_policy", (req, res) => {
	res.sendFile(path.join(__dirname, "/privacyPolicy.html"));
	res.status(200);
});
cron.schedule("*/20 * * * *", updateGamesStandings);

cron.schedule("0 0 1 * *", setGames);
