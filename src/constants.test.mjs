import { getSpinner, PICK_URL } from './constants';

describe('PICK_URL', () => {
	it('has a url', () => {
		expect(PICK_URL).toHaveProperty('url');
	});

	it('has headers', () => {
		expect(PICK_URL).toHaveProperty('headers');
	});

	it('has a transform function that returns a cheerio object', () => {
		expect(PICK_URL.transform('')).toBeDefined();
	});
});

describe('getSpinner', () => {
	it('returns a spinner', () => {
		expect(getSpinner()).toBeDefined();
	});
});
