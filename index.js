import express from "express";
import { getGames, getSports, getStandings, setStandings } from "./database.js";

const app = express();
const port = 8080;

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
	res.send("Hello, World!");
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
