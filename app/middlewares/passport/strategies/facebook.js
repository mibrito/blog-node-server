var mongoose = require('mongoose');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var facebook = require('./../config').facebook;
var User = mongoose.model('users');

exports.FacebookStrategy = new FacebookStrategy({

		// pull in our app id and secret from our auth.js file
		clientID	: facebook.clientID,
		clientSecret	: facebook.clientSecret,
		callbackURL	: facebook.callbackURL,
		passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
	},

	// facebook will send back the token and profile
	function(req, token, refreshToken, profile, done) {

		// asynchronous
		process.nextTick(function() {

			// check if the user is already logged in
			if (!req.isAuthenticated()) {
				// find the user in the database based on their facebook id
				User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

					// if there is an error, stop everything and return that
					// ie an error connecting to the database
					if (err)
						return done(err);

					// if the user is found, then log them in
					if (user) {
						user.facebook.token		= token;
						user.facebook.unlinked_at	= undefined;
						// save the user
						user.save(function(err) {
							if (err)
								throw err;
							return done(null, user);
						});
					} else {
						// if there is no user found with that facebook id, create them
						var newUser            = new User();

						// set all of the facebook information in our user model
						newUser.facebook.id    = profile.id; // set the users facebook id
						newUser.facebook.token = token; // we will save the token that facebook provides to the user
						newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
						newUser.facebook.link = profile.link;
						newUser.facebook.linked_at = Date.now();
						newUser.facebook.unlinked_at	= undefined;

						// save our user to the database
						newUser.save(function(err) {
							if (err)
								throw err;

							// if successful, return the new user
							return done(null, newUser);
						});
					}

				});
			} else {
				// user already exists and is logged in, we have to link accounts
				var user		= req.user; // pull the user out of the session

				// set all of the facebook information in our user model
				user.facebook.id		= profile.id; // set the users facebook id
				user.facebook.token		= token; // we will save the token that facebook provides to the user
				user.facebook.name		= profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
				user.facebook.profileUrl	= profile.profileUrl;
				user.facebook.linked_at		= Date.now();
				user.facebook.unlinked_at	= undefined;

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

exports.getAuthenticate = passport.authenticate('facebook', { scope: [ 'email' ] });
exports.postAuthenticate = passport.authenticate('facebook', {
	successRedirect : '/profile',
	failureRedirect : '/'
});
