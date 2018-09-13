import { WEEK_REGEX } from './constants';

export const getWeek = $ => {
	let week = 0;

	$('td').each((i, el) => {
		const $td = $(el);

		if ($td.find('td').length) return;

		week = parseWeekFromText($td.text().trim());

		if (week) return false;
	});

	if (!week) console.warn('Failed to get week');

	return week;
};

export const parseWeekFromText = text => {
	const weekResult = WEEK_REGEX.exec(text);

	if (weekResult) return parseInt(weekResult[1], 10);

	return 0;
};
