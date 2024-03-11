import { getSports, setStandings } from "./database.js";

export async function updateGames() {
	const sports = await getSports();
	for (let i = 0; i < sports.length; i++) {
		await setGames(sports[i].league_code);
	}
	console.log("done");
}
export async function updateStandings() {
	const sports = await getSports();
	for (let i = 0; i < sports.length; i++) {
		await setStandings(sports[i].league_code);
	}
	console.log("done");
}
