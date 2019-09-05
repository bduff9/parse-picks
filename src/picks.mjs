import { getSpinner, PICK_REGEX } from './constants.mjs';
import { sortPicks } from './sorting.mjs';
import { getWeek } from './week.mjs';

export const parsePicks = $ => {
	const spinner = getSpinner();
	const pickObj = {};
	let week;
	let allPicks;

	if (!$) return;

	spinner.setSpinnerTitle('Scraping HTML...');

	week = getWeek($);

	if (!week) return spinner.stop(true);

	pickObj.week = week;

	allPicks = getAllPicks($);

	if (allPicks.length === 0) return spinner.stop(true);

	pickObj.allPicks = allPicks.slice().sort(sortPicks);

	spinner.stop(true);

	pickObj.metadata = getPickMetadata(allPicks);

	return pickObj;
};

export const parsePickFromText = text => {
	const pickResult = PICK_REGEX.exec(text);

	if (pickResult) {
		return {
			isPick: true,
			points: parseInt(pickResult[1], 10),
			team: pickResult[2].toUpperCase(),
		};
	} else {
		return { isPick: false };
	}
};

export const getAllPicks = $ => {
	const allPicks = [];
	let $wrapper = null;

	$('table').each((_, tableEl) => {
		const $table = $(tableEl);

		if ($table.find('table').length) return;

		$table.find('td').each((_, tdEl) => {
			const $td = $(tdEl);
			const text = $td.text().trim();
			const { isPick } = parsePickFromText(text);

			if (isPick) console.log({ text });

			if (isPick) {
				$wrapper = $table.parent('div');

				return false;
			}
		});

		if ($wrapper !== null) return false;
	});

	$wrapper.find('td').each((_, el) => {
		const $td = $(el);

		if ($td.find('td').length) return;

		const text = $td.text().trim();
		const { isPick, points, team } = parsePickFromText(text);
		let found = false;

		if (!isPick) return;
		console.log({ text });

		// Search list for team
		allPicks.forEach(teamObj => {
			if (teamObj.team !== team) return;

			found = true;
			teamObj.points += points;
			teamObj.picked += 1;
			teamObj.average = teamObj.points / teamObj.picked;
		});

		// Otherwise add it
		if (!found) {
			let newTeam = { team, points, picked: 1, average: points };

			allPicks.push(newTeam);
		}
	});

	if (allPicks.length === 0) console.warn('No picks found');
	console.log({ allPicks });
	return allPicks;
};

export const getPeople = allPicks => {
	const peopleCounts = allPicks.map(pickObj => pickObj.picked);

	if (peopleCounts.length === 0) throw new Error('You must pass at least one pick');

	return Math.max.apply(Math, peopleCounts);
};

export const getPickCount = allPicks => {
	return allPicks.reduce((picks, pickObj) => picks + pickObj.picked, 0);
};

export const getGameCount = ({ people, picks }) => {
	if (!people) throw new Error('There must be at least 1 person');

	if (!picks) throw new Error('There must be at least 1 pick');

	if (picks % people !== 0) throw new Error(`${picks} picks does not evenly divide by ${people} people`);

	return picks / people;
};

export const getPickMetadata = allPicks => {
	const metadata = {
		people: getPeople(allPicks),
		picks: getPickCount(allPicks),
	};

	metadata.gameCt = getGameCount(metadata);

	return metadata;
};
