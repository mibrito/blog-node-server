var local = require('./strategies/local');
var google = require('./strategies/google');
var twitter = require('./strategies/twitter');
var facebook = require('./strategies/facebook');

var config = require('./config');

/**
 * route services to oauth
 */

module.exports = function(app, passport){

// NEW ACCOUNTS =====================

	// LOCAL ----------------------------

	// Signup local: show the signup form
	app.get('/signup', function(req, res){
		res.render(config.views.signup, {
			title: 'SignUp',
			action_signup: '/signup',
			message: req.flash('signupMessage')
		});
	});

	// Signup local: process the signup form
	app.post('/signup', local.postSingupAuthenticate);

	// Login local: show the login form
	app.get('/login', function(req, res) {
		res.render(config.views.login, {
			title: 'Login',
			message: req.flash('loginMessage')
		});
	});

	// Login local: process login form
	app.post('/login', local.postLoginAuthenticate);

	// GOOGLE ----------------------------

	// route for google authentication and login
	app.get('/auth/google', google.getAuthenticate);

	// handle the callback after google has authenticated the user
	app.get('/auth/google/callback', google.postAuthenticate);


	// TWITTER ----------------------------

	// route for twitter authentication and login
	app.get('/auth/twitter', twitter.getAuthenticate);

	// handle the callback after twitter has authenticated the user
	app.get('/auth/twitter/callback', twitter.postAuthenticate);


	// FACEBOOK ---------------------------

	// route for facebook authentication and login
	app.get('/auth/facebook', facebook.getAuthenticate);

	// handle the callback after facebook has authenticated the user
	app.get('/auth/facebook/callback', facebook.postAuthenticate);





// CONNECT ============================

	// LOCAL --------------------------------
	app.get('/connect/local', function(req, res) {
		res.render(config.views.signup, {
			title: 'Connect Local',
			action_signup: '/connect/local',
			message: req.flash('loginMessage') });
	});
	app.post('/connect/local', local.postSignupConnect);

	// GOOGLE --------------------------------

	// send to google to do the authentication
	app.get('/connect/google', google.getAuthenticate);

	// handle the callback after google has authorized the user
	app.get('/connect/google/callback', google.postAuthenticate);

	// TWITTER --------------------------------

	// send to twitter to do the authentication
	app.get('/connect/twitter', twitter.getAuthenticate);

	// handle the callback after twitter has authorized the user
	app.get('/connect/twitter/callback', twitter.postAuthenticate);

	// FACEBOOK -------------------------------

	// send to facebook to do the authentication
	app.get('/connect/facebook', facebook.getAuthenticate);

	// handle the callback after facebook has authorized the user
	app.get('/connect/facebook/callback', facebook.postAuthenticate);

// UNLINK =============================

	// LOCAL -----------------------------------
	app.get('/unlink/local', function(req, res) {
		var user            = req.user;
		user.local.email    = undefined;
		user.local.password = undefined;
		user.local.unlinked_at = Date.now();
		user.save(function(err) {
			if(user.unlinked())
				res.redirect('/logout');
			else
				res.redirect('/profile');
		});
	});


	// TODO erase function on user schema
	// GOOGLE ---------------------------------

	app.get('/unlink/google', function(req, res) {
		var user          = req.user;
		user.google.token = undefined;
		user.google.unlinked_at = Date.now();
		user.save(function(err) {
			if(user.unlinked())
				res.redirect('/logout');
			else
				res.redirect('/profile');
		});
	});


	// TWITTER --------------------------------

	app.get('/unlink/twitter', function(req, res) {
		var user           = req.user;
		user.twitter.token = undefined;
		user.twitter.unlinked_at = Date.now();
		user.save(function(err) {
			if(user.unlinked())
				res.redirect('/logout');
			else
				res.redirect('/profile');
		});
	});

	// FACEBOOK -------------------------------

	app.get('/unlink/facebook', function(req, res) {
		var user            = req.user;
		user.facebook.token = undefined;
		user.facebook.unlinked_at = Date.now();
		user.save(function(err) {
			if(user.unlinked())
				res.redirect('/logout');
			else
				res.redirect('/profile');
		});
	});


// PROFILE ============================

	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render(config.views.profile, {
			title: "Profile Page",
			user : req.user // get the user out of session and pass to template
		});
	});


// LOGOUT =============================

	// logout lateres
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});


};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
