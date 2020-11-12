import axios from 'axios';
import cheerio from 'cheerio';

import { getSpinner, PICK_URL, PICK_URL_OPTS } from './constants';

export const downloadHTML = async (): Promise<CheerioStatic | null> => {
	const spinner = getSpinner();

	spinner.setSpinnerTitle('Downloading HTML... %s');
	spinner.start();

	try {
		const { data } = await axios.get(PICK_URL, PICK_URL_OPTS);
		const $ = cheerio.load(data);

		spinner.stop(true);
		console.log('HTML downloaded!');

		return $;
	} catch (error) {
		spinner.stop(true);
		console.error('Error on getting HTML', error);

		return null;
	}
};
