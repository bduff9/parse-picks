import request from 'request-promise-native';
import Spinner from 'cli-spinner';

import { PICK_URL } from './src/constants';
import { renderOutput } from './src/display';
import { getAllPicks } from './src/picks';
import { sortPicks } from './src/sorting';
import { getWeek } from './src/week';

async function parsePicks () {
	const spinner = new Spinner.Spinner('Downloading HTML... %s');
	spinner.setSpinnerString(26);
	spinner.start();

	try {
		const $ = await request(PICK_URL);
		const week = getWeek($);
		const allPicks = getAllPicks($);

		spinner.stop(true);

		if (!week) {
			console.warn('Failed to get week');

			return;
		}

		if (allPicks.length === 0) {
			console.warn('No picks found');

			return;
		}

		allPicks.sort(sortPicks);

		renderOutput(allPicks, week);
	} catch (error) {
		console.error('Error on getting HTML', error);

		return;
	}
}

parsePicks();
