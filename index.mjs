import request from 'request-promise-native';

import { renderOutput } from './src/display.mjs';
import { downloadHTML } from './src/download.mjs';
import { parsePicks } from './src/picks.mjs';

export const main = async () => {
	const $ = await downloadHTML(request);
	const pickObj = parsePicks($);

	renderOutput(pickObj);
};

main();
