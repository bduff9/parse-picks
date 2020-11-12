import mockConsole from 'jest-mock-console';

import { downloadHTML } from '../download';

describe('download.ts', (): void => {
	it('calls request', async (): Promise<void> => {
		const restoreConsole = mockConsole();

		await downloadHTML();

		expect(console.log).toHaveBeenCalledTimes(0);

		restoreConsole();
	});

	it('returns null on error', async (): Promise<void> => {
		const restoreConsole = mockConsole();
		const result = await downloadHTML();

		expect(console.error).toHaveBeenCalledTimes(1);
		expect(result).toBeNull();

		restoreConsole();
	});
});
