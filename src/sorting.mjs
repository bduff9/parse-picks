export const sortPicks = (teamA, teamB) => {
	const { points: pointsA, picked: pickedA, average: averageA } = teamA;
	const { points: pointsB, picked: pickedB, average: averageB } = teamB;

	if (pickedA < pickedB) return 1;

	if (pickedA > pickedB) return -1;

	if (averageA < averageB) return 1;

	if (averageA > averageB) return -1;

	if (pointsA < pointsB) return 1;

	if (pointsA > pointsB) return -1;

	return 0;
};
