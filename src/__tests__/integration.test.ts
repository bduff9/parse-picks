import fs from 'fs';

import axios from 'axios';
import mockConsole from 'jest-mock-console';

import { main } from '../index';

jest.mock('axios');

// Load sample HTML from a file in the mock data folder
const getMockHTML = (): string =>
	fs.readFileSync('./src/__mockData__/sample.html', 'utf8');

describe('Integration', (): void => {
	test('Sample HTML file is parsed as expected', async (): Promise<void> => {
		const data = {
			data: getMockHTML(),
		};
		const restoreConsole = mockConsole();

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		axios.get.mockImplementationOnce(() => Promise.resolve(data));

		await main();

		expect(console.log).toHaveBeenCalledTimes(161);
		restoreConsole();
	});
});
