import mockConsole from 'jest-mock-console';

import { main } from '../../index';

jest.mock('../__mocks__/request-promise-native');

describe('Integration', () => {
	test('Sample HTML file is parsed as expected', async () => {
		const restoreConsole = mockConsole();

		await main();

		expect(console.log).toHaveBeenCalledTimes(22);

		restoreConsole();
	});
});
