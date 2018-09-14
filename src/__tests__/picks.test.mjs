import cheerio from 'cheerio';
import mockConsole from 'jest-mock-console';

import { getAllPicks, getGameCount, getPeople, getPickCount, getPickMetadata, parsePickFromText, parsePicks } from '../picks';

describe('parsePicks', () => {
	it('returns undefined with no html given', () => {
		expect(parsePicks(null)).toBeUndefined();
	});

	it('calls $ once with no week passed', () => {
		const restoreConsole = mockConsole();
		const $ = cheerio.load('');
		const mock$ = jest.fn(selector => $(selector));

		parsePicks(mock$);

		expect(mock$).toHaveBeenCalledTimes(1);
		expect(console.warn).toHaveBeenCalledTimes(1);

		restoreConsole();
	});

	it('calls $ 4 times with no picks passed', () => {
		const $ = cheerio.load(`
<table>
	<tr>
		<td>Wk 3</td>
	</tr>
</table>
		`);
		const mock$ = jest.fn(selector => $(selector));

		parsePicks(mock$);

		expect(mock$).toHaveBeenCalledTimes(4);
	});

	it('returns correct onject with valid HTML', () => {
		const $ = cheerio.load(`
<table>
	<tr>
		<td>Bad Content</td>
	</tr>
	<tr>
		<td>Wk 3</td>
		<td>.2 - CHI</td>
		<td>.2 - CHI</td>
		<td>.1 - GB</td>
		<td>.1 - BUF</td>
	</tr>
</table>
		`);
		const allPicks = [
			{ average: 2, picked: 2, points: 4, team: 'CHI' },
			{ average: 1, picked: 1, points: 1, team: 'GB' },
			{ average: 1, picked: 1, points: 1, team: 'BUF' },
		];
		const metadata = {
			gameCt: 2,
			people: 2,
			picks: 4,
		};
		const expected = { week: 3, allPicks, metadata };

		expect(parsePicks($)).toMatchObject(expected);
	});
});

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

describe('getAllPicks', () => {
	it('calls each', () => {
		const restoreConsole = mockConsole();
		const each = jest.fn();
		const $ = selector => ({ each });

		getAllPicks($);

		expect(each).toHaveBeenCalledTimes(1);

		restoreConsole();
	});

	it('returns []', () => {
		const restoreConsole = mockConsole();
		const $ = cheerio.load('');

		expect(getAllPicks($).length).toEqual(0);

		restoreConsole();
	});

	it('returns 2 picks', () => {
		const $ = cheerio.load(`
<table>
	<tr>
		<td>
			<table>
				<tr>
					<td>Bad Content</td>
				</tr>
			</table>
		</td>
		<td>.2 - CHI</td>
		<td>.2 - CHI</td>
		<td>.1 - GB</td>
	</tr>
</table>
		`);

		expect(getAllPicks($).length).toEqual(2);
	});
});

describe('getPickMetadata', () => {
	it('errors on no picks', () => {
		const picks = [];

		expect(() => getPickMetadata(picks)).toThrowError('You must pass at least one pick');
	});

	it('returns correct metadata', () => {
		const picks = [{ picked: 4 }];
		const expectedMetadata = { gameCt: 1, people: 4, picks: 4 };

		expect(getPickMetadata(picks)).toMatchObject(expectedMetadata);
	});
});
