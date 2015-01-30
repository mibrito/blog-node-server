var mongoose = require('mongoose');
var Posts = mongoose.model('Posts');

route = '/posts';

module.exports = function(server, express, log){

	var router = express.Router();

	// READ ONLY FUNCTIONS ========================================

	// Used in endpoint /api/posts with GET
	// Get posts by _id
	router.get(
		'/',
		function(req, res){
			Posts.find(function(err, posts){
				if(err)	res.send(err);
				else res.send(posts);
			});
	});

	// Used in endpoint /api/post/:id with GET
	// Get posts by _id
	router.get(
		'/:id',
		function(req, res) {
			Posts.findById(req.params.id, function(err, post) {
				if (err) res.send(err);
				else res.send(post);
			});
		}
	);

	// Used in endpoint /api/application/created_by/:id with GET
	// Get posts by _id of user which create
	router.get(
		'/created_by/:id',
		function(req, res) {
			Posts.find()
			.where({'created_by': req.params.id})
			.exec(function(err, post) {
				if (err) res.send(err);
				else res.send(post);
			});
		}
	);

	// WRITE APPLICATIONS =========================================

	// Used in endpoint /api/posts with POST
	router.post(
		'/',
		function(req, res){
			var post = new Posts();
			log.info(req.body);
			post.title = req.body.title;
			post.content = req.body.content;
			post.created_by = req.body.created_by;

			// Save the beer and check for errors
			post.save(function(err) {
				if (err) res.send(err);
				else res.send(post);
			});
		}
	);

	// Create endpoint /api/application/model/:id for POST
	// Change the model of the contributions of an specific
	// application, referenced by _id
	router.put(
		'/:id',
		function(req, res) {
			// Use the Application model to find a specific beer
			Posts.findById(req.params.id, function(err, post) {
				if(err){
					res.send(err);
				}else if(!post){
					res.send({message: 'not found'});
				}else{
					//console.log(req.body);
					//console.log(req);
					post.title = req.body.title;
					post.content = req.body.content;

					// Save the beer and check for errors
					post.save(function(err, post) {
						if (err) res.send({msg:'error', err:err});
						else res.send({msg:'success', data:post});
					});
				}
			});
		}
	);



	// Create endpoint /api/application/:id for GET
	// Delete an specific application by its _id
	router.delete(
		'/:id',
		function(req, res) {
			Posts.findByIdAndRemove(req.params.id, function(err, result) {
				//log.info(result);
				if (err) res.send({msg:'error', err:err});
				else res.send({msg:'success'});
			});
		}
	);

	server.use('/posts', router);
};
