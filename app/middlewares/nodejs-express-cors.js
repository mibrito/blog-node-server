// ./middlewares/nodejs-express-cors.js

// Express CORS middleware.. so much easier than trying to get Restify to work

var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With, Accept, Origin, Referer, User-Agent, Content-Type, Authorization');

	// intercept OPTIONS method
	if (req.method === 'OPTIONS') {
		res.send(200);
	}
	else {
		next();
	}
};

module.exports = function (server) {
	server.use(allowCrossDomain);   // make sure this is is called before the router
};

// hat tip:
//  http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
//  http://stackoverflow.com/questions/11001817/allow-cors-rest-request-to-a-express-node-js-application-on-heroku
//  http://bl.ocks.org/cmdoptesc/6291011#nodejs-express-cors.js
