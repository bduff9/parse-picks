import cheerio from 'cheerio';

export const PICK_URL = {
	url: 'http://www.4nflpicks.com/poolpicks.html',
	headers: {
		'User-Agent': 'request',
	},
	transform: body => cheerio.load(body),
};

export const WEEK_REGEX = /Wk.(\d{1,2}).*/g;

export const PICK_REGEX = /\.(\d{1,2})\s+-\s+(\D{2,3})/;

export const LINE_SEP = '--------------------------------------------------------------------------';
