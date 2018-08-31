const request = require('request');
const cheerio = require('cheerio');

const PICK_URL = 'http://www.4nflpicks.com/poolpicks.html';
const options = {
  url: PICK_URL,
  headers: {
    'User-Agent': 'request'
  }
};
const WEEK_REGEX = /Wk.(\d{1,2}).*/g;
const PICK_REGEX = /\.(\d{1,2})\s+-\s+(\D{2,3})/;
const LINE_SEP = '---------------------------------------------------------------------------------------';

function parseURL () {
	request(options, function readPicks (error, response, body) {
		const $ = cheerio.load(body);
		const allPicks = [];
		let week = 0;
		let picks = 0;
		let gameCt = 0;
		let found;
		let people;

		if (error) {
			console.error('Error on getting HTML', error);

			return;
		}

		$('td').each(function (i, el) {
			if ($(el).find('td').length) return;

			const pick = $(el).text().trim();
			const weekResult = WEEK_REGEX.exec(pick);
			const pickResult = PICK_REGEX.exec(pick);
			let team;
			let points;

			if (weekResult) week = parseInt(weekResult[1], 10);
console.log('pick', pick);
			if (pickResult) {
				points = parseInt(pickResult[1], 10);
				team = pickResult[2].toUpperCase();

				if (points > gameCt) gameCt = points;

				found = false;
console.log('pick', pick);
console.log('team', team);
console.log('points', points);
				// Search list for team
				allPicks.forEach(teamObj => {
					if (teamObj.team !== team) return;

					found = true;
					teamObj.points += points;
					teamObj.picked += 1;
					teamObj.average = teamObj.points / teamObj.picked;
				});

				// Otherwise add it
				if (!found) {
					let newTeam = { team, points, picked: 1, average: points };

					allPicks.push(newTeam);
				}

				picks++;
			}
		});

		if (allPicks.length === 0) {
			console.warn('No picks found');

			return;
		}

console.log('allPicks', allPicks);
		allPicks.sort(sortPicks);
console.log('allPicks', allPicks);

		people = picks / gameCt;

		console.log(`${picks} total picks (by ${people} people) in week ${week} for ${gameCt} total games`);
		console.log(LINE_SEP);

		allPicks.forEach(teamObj => {
			const { team, points, picked, average } = teamObj;

			if (gameCt < 0) return;

			if (gameCt == 0) console.log(LINE_SEP);

			console.log(`${gameCt--}. ${team} - ${points} points by ${picked} people for an average of ${average.toFixed(2)} points per person`);

		});
	});
}

function sortPicks (teamA, teamB) {
	const { points: pointsA, picked: pickedA, average: averageA } = teamA;
	const { points: pointsB, picked: pickedB, average: averageB }= teamB;

	if (pickedA < pickedB) return 1;

	if (pickedA > pickedB) return -1;

	if (averageA < averageB) return 1;

	if (averageA > averageB) return -1;

	if (pointsA < pointsB) return 1;

	if (pointsA > pointsB) return -1;

	return 0;
}

parseURL();
