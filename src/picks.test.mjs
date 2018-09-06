import { getGameCount, getPeople, getPickCount, parsePickFromText } from './picks';

describe('getGameCount', () => {
	it('returns a valid value', () => {
		const obj = { people: 4, picks: 64 };

		expect(getGameCount(obj)).toEqual(16);
	});

	it('throws an error when people is 0', () => {
		const obj = { people: 0, picks: 64 };

		expect(() => getGameCount(obj)).toThrowError();
	});

	it('throws an error when picks is 0', () => {
		const obj = { people: 4, picks: 0 };

		expect(() => getGameCount(obj)).toThrowError();
	});

	it('throws an error when there\'s a remainder', () => {
		const obj = { people: 4, picks: 63 };

		expect(() => getGameCount(obj)).toThrowError();
	});
});

describe('getPeople', () => {
	it('returns the max value', () => {
		const arr = [{ picked: 3 }, { picked: 4 }];

		expect(getPeople(arr)).toEqual(4);
	});

	it('throws an error when array is empty', () => {
		expect(() => getPeople([])).toThrowError();
	});
});

describe('getPickCount', () => {
	it('returns the summed value', () => {
		const arr = [{ picked: 3 }, { picked: 4 }];

		expect(getPickCount(arr)).toEqual(7);
	});
});

describe('parsePickFromText', () => {
	it('returns isPick false', () => {
		expect(parsePickFromText('')).toHaveProperty('isPick', false);
	});

	it('returns a valid pick', () => {
		const obj = parsePickFromText('This is pick .3 - CHI');

		expect(obj).toHaveProperty('isPick', true);
		expect(obj).toHaveProperty('points', 3);
		expect(obj).toHaveProperty('team', 'CHI');
	});
});
