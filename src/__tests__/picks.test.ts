import cheerio from 'cheerio';
import mockConsole from 'jest-mock-console';

import {
	getAllPicks,
	getGameCount,
	getPeople,
	getPickCount,
	getPickMetadata,
	parsePickFromText,
	parsePicks,
	TPickMetadata,
	TTeam,
} from '../picks';

describe('parsePicks', (): void => {
	it('returns undefined with no html given', (): void => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		const result = parsePicks(null);

		expect(result.allPicks.length).toBe(0);
		expect(result.metadata).toStrictEqual({ people: 0, picks: 0 });
		expect(result.week).toBe(-1);
	});

	it('calls $ once with no week passed', (): void => {
		const restoreConsole = mockConsole();
		const $ = cheerio.load('');
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		const mock$: cheerio.Root = jest.fn(selector => $(selector));

		parsePicks(mock$);

		expect(mock$).toHaveBeenCalledTimes(1);
		expect(console.warn).toHaveBeenCalledTimes(1);

		restoreConsole();
	});

	it('calls $ 4 times with no picks passed', (): void => {
		const restoreConsole = mockConsole();
		const $ = cheerio.load(`
<table>
	<tr>
		<td>Wk 3</td>
	</tr>
</table>
		`);
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		const mock$: cheerio.Root = jest.fn(selector => $(selector));

		parsePicks(mock$);

		expect(mock$).toHaveBeenCalledTimes(3);
		expect(console.warn).toHaveBeenCalledTimes(1);

		restoreConsole();
	});

	it('returns correct object with valid HTML', (): void => {
		const restoreConsole = mockConsole();
		const $ = cheerio.load(`
<div>
	<table>
		<tr>
			<td>Bad Content</td>
		</tr>
		<tr>
			<td>
				<div>
					<div>
						<div>
							<table>
								<tr>
									<td>Wk 3</td>
									<td>.2 - CHI</td>
									<td>.2 - CHI</td>
									<td>.1 - GB</td>
									<td>.1 - BUF</td>
								</tr>
							</table>
						</div>
					</div>
				</div>
			</td>
		</tr>
	</table>
</div>
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
		restoreConsole();
	});
});

describe('getGameCount', (): void => {
	it('returns a valid value', (): void => {
		const obj = { people: 4, picks: 64 };

		expect(getGameCount(obj)).toEqual(16);
	});

	it('throws an error when people is 0', (): void => {
		const obj = { people: 0, picks: 64 };

		expect(() => getGameCount(obj)).toThrowError();
	});

	it('throws an error when picks is 0', (): void => {
		const obj = { people: 4, picks: 0 };

		expect(() => getGameCount(obj)).toThrowError();
	});

	it("throws an error when there's a remainder", (): void => {
		const obj = { people: 4, picks: 63 };

		expect(() => getGameCount(obj)).toThrowError();
	});
});

describe('getPeople', (): void => {
	it('returns the max value', (): void => {
		const arr = [
			{ picked: 3, points: 3, average: 1 },
			{ picked: 4, points: 8, average: 2 },
		];

		expect(getPeople(arr)).toEqual(4);
	});

	it('throws an error when array is empty', (): void => {
		expect(() => getPeople([])).toThrowError();
	});
});

describe('getPickCount', (): void => {
	it('returns the summed value', (): void => {
		const arr = [
			{ picked: 3, points: 3, average: 1 },
			{ picked: 4, points: 8, average: 2 },
		];

		expect(getPickCount(arr)).toEqual(7);
	});
});

describe('parsePickFromText', (): void => {
	it('returns isPick false', (): void => {
		expect(parsePickFromText('')).toHaveProperty('isPick', false);
	});

	it('returns a valid pick', (): void => {
		const obj = parsePickFromText('.3 - CHI');

		expect(obj).toHaveProperty('isPick', true);
		expect(obj).toHaveProperty('points', 3);
		expect(obj).toHaveProperty('team', 'CHI');
	});
});

describe('getAllPicks', (): void => {
	it('calls each', (): void => {
		const restoreConsole = mockConsole();
		const each = jest.fn();
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		const $: cheerio.Root = (): unknown => ({ each });

		getAllPicks($);

		expect(each).toHaveBeenCalledTimes(1);

		restoreConsole();
	});

	it('returns []', (): void => {
		const restoreConsole = mockConsole();
		const $ = cheerio.load('');

		expect(getAllPicks($).length).toEqual(0);

		restoreConsole();
	});

	it('returns 2 picks', (): void => {
		const restoreConsole = mockConsole();
		const $ = cheerio.load(`
<div>
	<table>
		<tr>
			<td>Bad Content</td>
		</tr>
		<tr>
			<td>
				<div>
					<div>
						<div>
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
						</div>
					</div>
				</div>
			</td>
		</tr>
	</table>
</div>
		`);

		expect(getAllPicks($).length).toEqual(2);
		restoreConsole();
	});
});

describe('getPickMetadata', (): void => {
	it('errors on no picks', (): void => {
		const restoreConsole = mockConsole();
		const picks: TTeam[] = [];

		expect(() => getPickMetadata(picks)).toThrowError(
			'You must pass at least one pick',
		);
		restoreConsole();
	});

	it('returns correct metadata', (): void => {
		const restoreConsole = mockConsole();
		const picks: TTeam[] = [{ picked: 4, points: 8, average: 2 }];
		const expectedMetadata: TPickMetadata = { gameCt: 1, people: 4, picks: 4 };

		expect(getPickMetadata(picks)).toMatchObject(expectedMetadata);
		restoreConsole();
	});
});
