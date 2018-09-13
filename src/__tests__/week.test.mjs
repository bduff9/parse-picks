import cheerio from 'cheerio';
import mockConsole from 'jest-mock-console';

import { getWeek, parseWeekFromText } from '../week';

describe('getWeek', () => {
	it('calls each', () => {
		const restoreConsole = mockConsole();
		const each = jest.fn();
		const $ = selector => ({ each });

		getWeek($);

		expect(each).toHaveBeenCalledTimes(1);

		restoreConsole();
	});

	it('returns 0', () => {
		const restoreConsole = mockConsole();
		const $ = cheerio.load('');

		expect(getWeek($)).toEqual(0);

		restoreConsole();
	});

	it('returns 3', () => {
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
		<td>Wk 3</td>
	</tr>
</table>
		`);

		expect(getWeek($)).toEqual(3);
	});
});

describe('parseWeekFromText', () => {
	it('returns 0 when no text given', () => {
		expect(parseWeekFromText('')).toEqual(0);
	});

	it('returns 1 for valid week 1', () => {
		expect(parseWeekFromText('This is Wk.1 of the season')).toEqual(1);
	});
});
