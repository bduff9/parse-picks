import { getSpinner, PICK_URL, PICK_URL_OPTS } from '../constants';

describe('PICK_URL', (): void => {
	it('has headers', (): void => {
		expect(PICK_URL_OPTS).toHaveProperty('headers');
	});

	it('has a URL', (): void => {
		expect(PICK_URL).toBeDefined();
	});
});

describe('getSpinner', (): void => {
	it('returns a spinner', (): void => {
		expect(getSpinner()).toBeDefined();
	});
});
