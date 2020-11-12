import mockConsole from 'jest-mock-console';

import { padValue, renderOutput } from '../display';

describe('padValue', (): void => {
	it('pads a number', (): void => {
		expect(padValue(3, 2)).toEqual('3 ');
	});

	it('pads a string', (): void => {
		expect(padValue('a', 2)).toEqual('a ');
	});

	it("doesn't pad if already desired length", (): void => {
		expect(padValue('abc', 3)).toEqual('abc');
	});

	it('pads front', (): void => {
		expect(padValue(1, 2, true)).toEqual(' 1');
	});

	it('pads with other chars', (): void => {
		expect(padValue(1, 3, false, '@')).toEqual('1@@');
	});
});

describe('renderOutput', (): void => {
	it('outputs 3 lines for no games', (): void => {
		const restoreConsole = mockConsole();
		const pickObj = {
			allPicks: [],
			metadata: { people: 0, picks: 0 },
			week: 0,
		};

		renderOutput(pickObj);

		expect(console.log).toHaveBeenCalledTimes(3);

		restoreConsole();
	});

	it('outputs 6 lines for 1 game', (): void => {
		const restoreConsole = mockConsole();
		const teamObj = {
			average: 15,
			picked: 2,
			points: 30,
			team: 'TEST',
		};
		const pickObj = {
			allPicks: [teamObj, teamObj, teamObj],
			metadata: { gameCt: 1, people: 2, picks: 2 },
			week: 1,
		};

		renderOutput(pickObj);

		expect(console.log).toHaveBeenCalledTimes(6);

		restoreConsole();
	});
});
