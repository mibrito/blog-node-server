// login
var flash	= require('connect-flash');
var session	= require('express-session');

module.exports = function(server, passport){
	// passport login
	server.use(passport.initialize());
	server.use(session({
		secret:			'keyboard cat',
		resave:			false,
		saveUninitialized:	false
	}));
	server.use(flash()); // use connect-flash for flash messages stored in session

	require("./config").config(passport);
	require("./routes")(server);
};
