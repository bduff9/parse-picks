import { sortPicks } from '../sorting';

describe('sortPicks', () => {
	const obj1 = { points: 12, picked: 4, average: 3 };
	const obj3 = { points: 9, picked: 3, average: 3 };
	const obj4 = { points: 8, picked: 4, average: 2 };

	it('higher picks returns -1', () => {
		expect(sortPicks(obj1, obj3)).toEqual(-1);
	});

	it('lower picks returns 1', () => {
		expect(sortPicks(obj3, obj1)).toEqual(1);
	});

	it('higher average returns -1', () => {
		expect(sortPicks(obj1, obj4)).toEqual(-1);
	});

	it('lower average returns 1', () => {
		expect(sortPicks(obj4, obj1)).toEqual(1);
	});

	it('returns 0 when all 3 values are equal', () => {
		expect(sortPicks(obj1, obj1)).toEqual(0);
	});
});
