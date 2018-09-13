import request from 'request-promise-native';

import { renderOutput } from './src/display';
import { downloadHTML } from './src/download';
import { parsePicks } from './src/picks';

(async () => {
	const $ = await downloadHTML(request);
	const pickObj =	parsePicks($);

	renderOutput(pickObj);
})();
