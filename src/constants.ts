import Spinner from 'cli-spinner';

export const getSpinner = () => {
	const spinner = new Spinner.Spinner();

	spinner.setSpinnerString(26);

	return spinner;
};

export const PICK_URL = 'http://www.4nflpicks.com/poolpicks.html';
export const PICK_URL_OPTS = {
	headers: {
		'User-Agent': 'request',
	},
};

export const WEEK_REGEX = /Wk.(\d{1,2}).*/g;

export const PICK_REGEX = /^\.(\d{1,2})\s+-\s+(\D{2,3})\*?$/;

export const LINE_SEP =
	'--------------------------------------------------------------------------';
