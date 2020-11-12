import { getSpinner, PICK_REGEX } from './constants';
import { sortPicks } from './sorting';
import { getWeek } from './week';

export type TPickMetadata = {
	gameCt?: number;
	people: number;
	picks: number;
};
export type TTeam = {
	average: number;
	picked: number;
	points: number;
	team?: string;
};
export type TParsedPicks = {
	allPicks: TTeam[];
	metadata: TPickMetadata;
	week: number;
};

export const parsePicks = ($: CheerioStatic): TParsedPicks => {
	const spinner = getSpinner();
	const pickObj: TParsedPicks = {
		allPicks: [],
		metadata: {
			people: 0,
			picks: 0,
		},
		week: -1,
	};
	let week: number;
	let allPicks: TTeam[];

	if (!$) return pickObj;

	spinner.setSpinnerTitle('Scraping HTML...');

	week = getWeek($);

	if (!week) {
		spinner.stop(true);

		return pickObj;
	}

	pickObj.week = week;

	allPicks = getAllPicks($);

	if (allPicks.length === 0) {
		spinner.stop(true);

		return pickObj;
	}

	pickObj.allPicks = allPicks.slice().sort(sortPicks);

	spinner.stop(true);

	pickObj.metadata = getPickMetadata(allPicks);

	return pickObj;
};

export const parsePickFromText = (text: string): {
	isPick: boolean;
	points?: number;
	team?: string;
} => {
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

export const getAllPicks = ($: CheerioStatic) => {
	const allPicks: TTeam[] = [];

	$('div > table div > div > div').each((_, div): false | void => {
		const $div = $(div);

		$div.find('td').each((_, td): void => {
			const $td = $(td);

			if ($td.find('td').length) return;

			const text = $td.text().trim();
			const { isPick, points, team } = parsePickFromText(text);
			let found = false;

			console.log({ isPick, text });

			if (!isPick) return;

			// Search list for team
			allPicks.forEach(teamObj => {
				if (teamObj.team !== team) return;

				found = true;
				teamObj.points += points || 0;
				teamObj.picked += 1;
				teamObj.average = teamObj.points / teamObj.picked;
			});

			// Otherwise add it
			if (!found) {
				const newTeam = { team, points: points || 0, picked: 1, average: points || 0 };

				allPicks.push(newTeam);
			}
		});

		if (allPicks.length) return false;
	});

	if (allPicks.length === 0) console.warn('No picks found');

	return allPicks;
};

export const getPeople = (allPicks: TTeam[]): number => {
	const peopleCounts = allPicks.map(pickObj => pickObj.picked);

	if (peopleCounts.length === 0) throw new Error('You must pass at least one pick');

	return Math.max.apply(Math, peopleCounts);
};

export const getPickCount = (allPicks: TTeam[]): number =>
	allPicks.reduce((picks, pickObj) => picks + pickObj.picked, 0);

export const getGameCount = ({ people, picks }: TPickMetadata): number => {
	if (!people) throw new Error('There must be at least 1 person');

	if (!picks) throw new Error('There must be at least 1 pick');

	if (picks % people !== 0) throw new Error(`${picks} picks does not evenly divide by ${people} people`);

	return picks / people;
};

export const getPickMetadata = (allPicks: TTeam[]): TPickMetadata => {
	console.log(allPicks);

	const metadata: TPickMetadata = {
		people: getPeople(allPicks),
		picks: getPickCount(allPicks),
	};

	metadata.gameCt = getGameCount(metadata);

	return metadata;
};
