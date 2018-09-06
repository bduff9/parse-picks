import { sortPicks } from './sorting';

describe('sortPicks', () => {
	const obj1 = { points: 12, picked: 4, average: 3 };
	const obj2 = { points: 0, picked: 0, average: 0 };

	it('returns -1', () => {
		expect(sortPicks(obj1, obj2)).toEqual(-1);
	});

	it('returns 1', () => {
		expect(sortPicks(obj2, obj1)).toEqual(1);
	});

	it('returns 0', () => {
		expect(sortPicks(obj1, obj1)).toEqual(0);
	});
});
