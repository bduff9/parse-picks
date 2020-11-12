import { LINE_SEP } from './constants';
import { TParsedPicks } from './picks';

export const padValue = (
	value: unknown,
	length: number,
	padFront = false,
	padChar = ' ',
): string => {
	const stringValue = `${value}`;

	if (padFront) return stringValue.padStart(length, padChar);

	return stringValue.padEnd(length, padChar);
};

export const renderOutput = ({
	allPicks,
	metadata,
	week,
}: TParsedPicks): void => {
	const { gameCt, people, picks } = metadata;
	let currentGame = gameCt || 0;

	console.log(LINE_SEP);
	console.log(
		`${picks} total picks (by ${people} people) in week ${week} for ${gameCt} total games`,
	);
	console.log(LINE_SEP);

	allPicks.forEach(teamObj => {
		const { team, points, picked, average } = teamObj;

		if (currentGame < 0) return;

		if (currentGame == 0) console.log(LINE_SEP);

		console.log(
			`${padValue(currentGame--, 2, true)}. ${padValue(team, 3)} - ${padValue(
				points,
				2,
				true,
			)} points by ${picked} people for an average of ${padValue(
				average.toFixed(2),
				5,
				true,
			)} points per person`,
		);
	});
};
