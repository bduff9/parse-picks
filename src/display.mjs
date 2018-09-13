import { LINE_SEP } from './constants';

export const padValue = (value, length, padFront = false, padChar = ' ') => {
	value = value.toString();

	if (padFront) return value.padStart(length, padChar);

	return value.padEnd(length, padChar);
};

export const renderOutput = ({ allPicks, metadata, week }) => {
	const { gameCt, people, picks } = metadata;
	let currentGame = gameCt;

	console.log(LINE_SEP);
	console.log(`${picks} total picks (by ${people} people) in week ${week} for ${gameCt} total games`);
	console.log(LINE_SEP);

	allPicks.forEach(teamObj => {
		const { team, points, picked, average } = teamObj;

		if (currentGame < 0) return;

		if (currentGame == 0) console.log(LINE_SEP);

		console.log(`${padValue(currentGame--, 2, true)}. ${padValue(team, 3)} - ${padValue(points, 2, true)} points by ${picked} people for an average of ${padValue(average.toFixed(2), 5, true)} points per person`);
	});
};
