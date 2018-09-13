import { getSpinner, PICK_URL } from './constants';

export const downloadHTML = async request => {
	const spinner = getSpinner();

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

		return null;
	}
};
