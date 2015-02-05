var mongoose = require('mongoose');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

var twitter = require('./../config').twitter;
var User = mongoose.model('users');

exports.TwitterStrategy = new TwitterStrategy({
        	consumerKey: twitter.consumerKey,
        	consumerSecret: twitter.consumerSecret,
        	callbackURL: twitter.callbackURL,
		passReqToCallback : true
	},
	function(req, token, tokenSecret, profile, done) {

		// make the code asynchronous
		// User.findOne won't fire until we have all our data back from Twitter
		process.nextTick(function() {
			// check if the user is already logged in
			if (!req.user) {
				User.findOne({ 'twitter.id' : profile.id }, function(err, user) {

					// if there is an error, stop everything and return that
					// ie an error connecting to the database
					if (err)
						return done(err);

					// if the user is found then log them in
					if (user) {
						// user found, if he came back set token
						// and return that user
						user.twitter.token		= token;
						user.twitter.unlinked_at	= undefined;
						user.save(function(err) {
							if (err)
								throw err;
							return done(null, user);
						});
					} else {
						// if there is no user, create them
						var newUser			= new User();

						// set all of the user data that we need
						newUser.twitter.id		= profile.id;
						newUser.twitter.token		= token;
						newUser.twitter.username	= profile.username;
						newUser.twitter.displayName	= profile.displayName;
						newUser.twitter.linked_at	= Date.now();

						// save our user into the database
						newUser.save(function(err) {
							if (err)
								throw err;
							return done(null, newUser);
						});
					}
				});
			}else{
				// if there is no user, create them
				var user			= req.user;

				// set all of the user data that we need
				user.twitter.id			= profile.id;
				user.twitter.token		= token;
				user.twitter.username		= profile.username;
				user.twitter.displayName	= profile.displayName;
				user.twitter.linked_at		= Date.now();
				user.twitter.unlinked_at	= undefined;

				console.log(user);
				// save our user into the database
				user.save(function(err) {
					if (err)
						throw err;
					return done(null, user);
				});
			}
		});
	}
);

exports.getAuthenticate = passport.authenticate('twitter');
exports.postAuthenticate = passport.authenticate('twitter', {
	successRedirect: '/profile',
	failureRedirect: '/'
});
