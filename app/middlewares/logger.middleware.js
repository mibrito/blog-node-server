// logger.middleware.js

module.exports = function (server, log) {
	server.use(function (req, res, next) {
		log.info({req:req}, 'TEST '+req.method);
		next();
	});
};
