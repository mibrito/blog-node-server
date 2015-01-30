// modules =====================================================================

var path		= require('path');
var bodyParser		= require('body-parser');
//var methodOverride	= require('method-override');


// Apply middlewares ===========================================================

module.exports = function(server, express, log){

	// uncomment after placing your favicon in /public
	//app.use(favicon(__dirname + '/public/favicon.ico'));

	// parse application/vnd.api+json as json
	server.use(bodyParser.json({ type: 'application/vnd.api+json' }));

	// parse application/x-www-form-urlencoded
	server.use(bodyParser.urlencoded({ extended: true }));

	//server.use(cookieParser());

	//app.use(methodOverride('X-HTTP-Method-Override'));

	// CUSTOM MIDDLEWARES
	require("./nodejs-express-cors")(server);
	require("./logger.middleware")(server, log);
};
