import { padValue } from './display';

describe('padValue', () => {
	it('pads a number', () => {
		expect(padValue(3, 2)).toEqual('3 ');
	});

	it('pads a string', () => {
		expect(padValue('a', 2)).toEqual('a ');
	});

	it('doesn\'t pad if already desired length', () => {
		expect(padValue('abc', 3)).toEqual('abc');
	});

	it('pads front', () => {
		expect(padValue(1, 2, true)).toEqual(' 1');
	});

	it('pads with other chars', () => {
		expect(padValue(1, 3, false, '@')).toEqual('1@@');
	});
});
