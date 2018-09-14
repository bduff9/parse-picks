const fs = require('fs');

const request = (urlObj) => new Promise((resolve, reject) => {
	// Load sample HTML from a file in the mock data folder
	fs.readFile('./src/__mockData__/sample.html', 'utf8', (err, body) => {
		if (err) reject(err);

		resolve(urlObj.transform(body));
	});
});

export default request;
