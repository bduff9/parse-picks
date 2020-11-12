import { renderOutput } from './display';
import { downloadHTML } from './download';
import { parsePicks } from './picks';

export const main = async (): Promise<void> => {
	const $ = await downloadHTML();

	if (!$) throw new Error('No HTML returned from URL');

	const pickObj = parsePicks($);

	renderOutput(pickObj);
};

main();
