import mockConsole from 'jest-mock-console';

import { downloadHTML } from '../download';

describe('', () => {
	it('calls request', async () => {
		const restoreConsole = mockConsole();
		const request = jest.fn();

		await downloadHTML(request);

		expect(console.log).toHaveBeenCalledTimes(1);
		expect(request).toHaveBeenCalledTimes(1);

		restoreConsole();
	});

	it('returns null on error', async () => {
		const restoreConsole = mockConsole();
		const result = await downloadHTML();

		expect(console.error).toHaveBeenCalledTimes(1);
		expect(result).toBeNull();

		restoreConsole();
	});
});
