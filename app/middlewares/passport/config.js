var mongoose = require('mongoose');
var Users = mongoose.model('users');

// TODO make internal routes softcoded
exports.routes = {
	root : '/',
	profile: '/profile'
};

exports.views = {
	login: 'passportviews/login',
	signup: 'passportviews/signup',
	profile: 'passportviews/profile',
};

exports.twitter = {
	consumerKey: "consumerKey",
	consumerSecret: "consumerSecret",
	callbackURL: "http://mydomain.com:3000/auth/twitter/callback"
};

exports.facebook = {
	clientID: "clientID",
	clientSecret: "clientSecret",
	callbackURL: "http://mydomain.com:3000/auth/facebook/callback"
};

exports.google = {
	clientID: "clientID.apps.googleusercontent.com",
	clientSecret: "clientSecret",
	callbackURL: "http://mydomain.com:3000/auth/google/callback"
};

exports.config = function(passport){
	passport.serializeUser(function(user, done) {
		// console.log("user"+user); // DEBUG
		if(user) done(null, user._id);
		else done(new Error('serializeUser found nothing'),null);
	});

	passport.deserializeUser(function(id, done) {
		Users.findOne({_id: id}, function(err, user) {
			if(err) done(err,null);
			if(!user) done(null,null);
			done(err, user);
		});
	});


	var local = require('./strategies/local');
	var google = require('./strategies/google');
	var twitter = require('./strategies/twitter');
	var facebook = require('./strategies/facebook');

	// passport login
	passport.use('local-signup', local.SignupLocalStrategy);
	passport.use('local-login', local.LoginLocalStrategy);
	passport.use('google', google.GoogleStrategy);
	passport.use('twitter', twitter.TwitterStrategy);
	passport.use('facebook', facebook.FacebookStrategy);
};
