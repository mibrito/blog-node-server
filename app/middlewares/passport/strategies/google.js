var mongoose = require('mongoose');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var google = require('./../config').google;
var User = mongoose.model('users');

exports.GoogleStrategy = new GoogleStrategy({

		clientID		: google.clientID,
		clientSecret		: google.clientSecret,
		callbackURL		: google.callbackURL,
		passReqToCallback	: true
	},
	function(req, accessToken, refreshToken, profile, done) {

		// make the code asynchronous
		// User.findOne won't fire until we have all our data back from Google
		process.nextTick(function() {
			// check if the user is already logged in
			if (!req.user) {
				// try to find the user based on their google id
				User.findOne({ 'google.id' : profile.id }, function(err, user) {
					if (err)
					return done(err);

					if (user) {
						// if a user is found, log them in
						user.google.token	= accessToken;
						user.google.unlinked_at	= undefined;
						// save the user
						user.save(function(err) {
							if (err)
								throw err;
							return done(null, user);
						});
					} else {
						// if the user isnt in our database, create a new user
						var newUser			= new User();

						// set all of the relevant information
						newUser.google.id		= profile.id;
						newUser.google.token		= accessToken;
						newUser.google.name		= profile.displayName;
						newUser.google.email		= profile.emails[0].value; // pull the first email
						newUser.google.linked_at	= Date.now();
						newUser.google.unlinked_at	= undefined;

						// save the user
						newUser.save(function(err) {
							if (err)
								throw err;
							return done(null, newUser);
						});
					}
				});
			}else{
				// if the user isnt in our database, create a new user
				var user          = req.user;

				// set all of the relevant information
				user.google.id		= profile.id;
				user.google.token	= accessToken;
				user.google.name	= profile.displayName;
				user.google.email	= profile.emails[0].value; // pull the first email
				user.google.linked_at	= Date.now();
				user.google.unlinked_at	= undefined;

				// save the user
				user.save(function(err) {
					if (err)
						throw err;
					return done(null, user);
				});
			}
		});

	}
);

exports.getAuthenticate = passport.authenticate('google', { scope : ['profile', 'email'] });
exports.postAuthenticate = passport.authenticate('google', {
	successRedirect: '/profile',
	failureRedirect: '/'
});
