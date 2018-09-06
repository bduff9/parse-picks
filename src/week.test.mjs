import { parseWeekFromText } from './week';

describe('parseWeekFromText', () => {
	it('returns 0 when no text given', () => {
		expect(parseWeekFromText('')).toEqual(0);
	});

	it('returns 1 for valid week 1', () => {
		expect(parseWeekFromText('This is Wk.1 of the season')).toEqual(1);
	});
});
