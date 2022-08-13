const express = require('express');

const app = express();

require('dotenv/config');

app.set('trust proxy', true);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', function (request, response) {
	return response.redirect(
		process.env.REDIRECT_URL ||
			'https://drive.google.com/uc?export=view&id=1Tg31PggA8KJE4EIhHue5fIBz3qskzfgF'
	);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message,
			test2: 'app.js issue',
		},
	});
});

app.listen(3001, () => {
	console.log('Server started!');
});
