var mongoose = require('mongoose');

// generate the object exported by module
var db = {};

// define the connection url
db.url = "mongodb://localhost/blog";

// verify the connection state of mongoose
db.readyState = function(){
	'use strict';
	return mongoose.connection.readyState;
};

// creates a mongo connection with mongoose
db.connect = function(callback){
	'use strict';
	return mongoose.connect(
			db.url,{},
			callback
		);
};

// disconnect from mongo
db.disconnect = function(callback){
	'use strict';
	return mongoose.disconnect(callback);
};

// declare model object
db.model = {};

// manualy load models
db.load = function(name){
	db.model[name] = require('./schemas/'+name);
	return db.model[name];
};

// load all models
db.loadModels= function(){
	return [
		//db.load('users'),
		db.load('applications')
	];
};

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
	//console.log('Mongoose default connection open to ' + db.url);
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
	//console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
	//console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
	mongoose.connection.close(function () {
		//console.log('Mongoose default connection disconnected through app termination');
		process.exit(0);
	});
});

db.model = {
	//users: require('./User'),
	posts: require('./posts.schema')
};

module.exports = db;
