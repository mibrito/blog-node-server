/*
mongoose = require ('mongoose');

wipeDbAfterTests = true;

describe("applications.schema", function(){

	//connect to our mongo test database, note how done is passed to mongoose connect
	before (function(done){
		mongoose.connect ("mongodb://localhost/blog", done);
	});

	// your test
	it("Doing Nothing", function(done) {
		// some call that has mongoose in there somewhere, you'll
		// need to call done at some point as mongoose is async
		done();
	});

	// close our mongoose connection, other wise your next test suite will fail
	// saying there is already an open connection
	after(function(done) {
		if(! wipeDbAfterTests){
			mongoose.connection.close(done);
		}else{
			mongoose.connection.db.executeDbCommand({ dropDatabase:1 }, function(err, result){
				mongoose.connection.close(done);
			});
		}
	});
});
*/
