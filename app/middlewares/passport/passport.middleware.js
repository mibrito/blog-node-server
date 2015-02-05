// login
var passport = require('passport');
var flash    = require('connect-flash');

module.exports = function(server){
	// passport login
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash()); // use connect-flash for flash messages stored in session

	require("./config").config(passport);
	require("./routes")(app, passport);
};
