import cheerio from 'cheerio';
import mockConsole from 'jest-mock-console';

import { getWeek, parseWeekFromText } from '../week';

describe('getWeek', (): void => {
	it('calls each', (): void => {
		const restoreConsole = mockConsole();
		const each = jest.fn();
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		const $: cheerio.Root = (): cheerio.Cheerio =>
			(({ each } as unknown) as cheerio.Cheerio);

		getWeek($);

		expect(each).toHaveBeenCalledTimes(1);

		restoreConsole();
	});

	it('returns 0', (): void => {
		const restoreConsole = mockConsole();
		const $ = cheerio.load('');

		expect(getWeek($)).toEqual(0);

		restoreConsole();
	});

	it('returns 3', (): void => {
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

describe('parseWeekFromText', (): void => {
	it('returns 0 when no text given', (): void => {
		expect(parseWeekFromText('')).toEqual(0);
	});

	it('returns 1 for valid week 1', (): void => {
		expect(parseWeekFromText('This is Wk.1 of the season')).toEqual(1);
	});
});
