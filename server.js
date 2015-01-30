// ./server.js

// modules =====================================================================

var express		= require('express');
var path		= require('path');
var bunyan		= require('bunyan');
var mongoose		= require('mongoose');


// configuration ===============================================================

db = require('./app/lib/db/config');	// always call before use models
db.connect();

// set our port
var port	= process.env.PORT || 3000;
var server		= express();


var log = bunyan.createLogger({
	name: "node-blog-server",                     // logger name
	serializers: {
		req: bunyan.stdSerializers.req,     // standard bunyan req serializer
		err: bunyan.stdSerializers.err      // standard bunyan error serializer
	},
	streams: [
		{
		level: 'info',                  // loging level
		stream: process.stdout          // log INFO and above to stdout
		}
	]
});

// Apply middlewares ===========================================================

require("./app/middlewares/middlewares")(server,express, log);


// main request
server.get(
	'/',
	function(req, res){
		res.send("Wellcome to NodeBlog' API!");
	}
);

require('./app/routes/posts.routes')(server, express, log);



// Start app ===============================================
// startup our app at http://localhost:3000
server.listen(port);

// shoutout to the user
log.info('Magic happens on port ' + port);

// expose server
exports = module.exports = server;
