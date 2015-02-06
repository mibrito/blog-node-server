// modules =====================================================================

var path		= require('path');
var bodyParser		= require('body-parser');
var passport		= require('passport');
var cookieParser	= require('cookie-parser');
//var methodOverride	= require('method-override');


// Apply middlewares ===========================================================

module.exports = function(server, express, log){

	// uncomment after placing your favicon in /public
	//app.use(favicon(__dirname + '/public/favicon.ico'));
	server.use(express.static(path.join(__dirname, 'app/views')));

	// parse application/vnd.api+json as json
	server.use(bodyParser.json({ type: 'application/vnd.api+json' }));

	// parse application/x-www-form-urlencoded
	server.use(bodyParser.urlencoded({ extended: true }));

	server.use(cookieParser());

	//app.use(methodOverride('X-HTTP-Method-Override'));

	log.info(path.join(__dirname, '../views/bower_components'));
	//server.use(express.static(path.join(__dirname, '../assets/public')));

	// CUSTOM MIDDLEWARES
	require("./cors.middleware")(server);
	require("./logger.middleware")(server, log);
	require("./passport/passport.middleware.js")(server, passport);
};
