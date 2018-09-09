import request from 'request-promise-native';

import { getSpinner, PICK_URL } from './src/constants';
import { renderOutput } from './src/display';
import { getAllPicks } from './src/picks';
import { sortPicks } from './src/sorting';
import { getWeek } from './src/week';

async function parsePicks () {
	const spinner = getSpinner();
	const $ = await downloadHTML(spinner);
	let week;
	let allPicks;

	if (!$) return;

	spinner.setSpinnerTitle('Scraping HTML...');

	week = getWeek($);

	if (!week) return spinner.stop(true);

	allPicks = getAllPicks($);

	if (allPicks.length === 0) return spinner.stop(true);

	allPicks.sort(sortPicks);
	spinner.stop(true);

	renderOutput(allPicks, week);
}

async function downloadHTML (spinner) {
	spinner.setSpinnerTitle('Downloading HTML... %s');
	spinner.start();

	try {
		const $ = await request(PICK_URL);

		spinner.stop(true);
		console.log('HTML downloaded!');

		return $;
	} catch (error) {
		spinner.stop(true);
		console.error('Error on getting HTML', error);

		return;
	}
}

parsePicks();
