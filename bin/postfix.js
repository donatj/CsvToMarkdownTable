const fs = require('fs');

fs.readFile('lib/CsvToMarkdown.js', 'utf8', (err, data) => {
	if (err) {
		console.error(err);
		return;
	}

	data = data.replace(/"use strict";/, '"use strict";\nif (typeof exports == "undefined") {\n    var exports = {};\n}\n');

	fs.writeFileSync('lib/CsvToMarkdown.js', data);

});

