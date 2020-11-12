import { TTeam } from "./picks";

export const sortPicks = (teamA: TTeam, teamB: TTeam): -1 | 0 | 1 => {
	const { picked: pickedA, average: averageA } = teamA;
	const { picked: pickedB, average: averageB } = teamB;

	if (pickedA < pickedB) return 1;

	if (pickedA > pickedB) return -1;

	if (averageA < averageB) return 1;

	if (averageA > averageB) return -1;

	return 0;
};
