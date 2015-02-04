var superagent	= require('superagent');



describe("applications.routes spec", function () {
	it('Posts a post', function(done){
		superagent.post('http://localhost:3000/posts')
			.type('form')
			.send({
				'title':'Test post',
				'content': 'POST Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
			})
			.end(function(e,res){
				// console.log(res.body);
				expect(e).to.eql(null);
				expect(res.status).to.not.equal(404);
				expect(res.status).to.not.equal(500);
				expect(res.body).to.not.be.undefined();
				// for more than one insertion per time
				// expect(res.body.length).to.eql(1);
				// expect(res.body[0]._id.length).to.eql(24);
				// id = res.body[0]._id;
				expect(res.body._id.length).to.eql(24);
				id = res.body._id;
				done();
			});
	});

	it("Retrieves all objects", function(done){
		superagent.get('http://localhost:3000/posts')
			.end(function(e, res){
				// console.log(res.body)
				expect(e).to.be.null();
				expect(typeof res.body).to.be.equal('object');
				expect(res.status).to.not.equal(404);
				expect(res.status).to.not.equal(500);
				expect(res.body.length).to.be.above(0);
				expect(res.body.map(function (item){return item._id;})).to.contain(id);
				done();
			});
	});

	it('Retrieves an object', function(done){
		superagent.get('http://localhost:3000/posts/'+id)
			.end(function(e, res){
				// console.log(res.body)
				expect(e).to.eql(null);
				expect(typeof res.body).to.eql('object');
				expect(res.body._id.length).to.eql(24);
				expect(res.body._id).to.eql(id);
				done();
			});
	});

	it('Updates an object', function(done){
		superagent.put('http://localhost:3000/posts/'+id)
			.type('form')
			.send({
				title: 'Test put',
				content: 'PUT Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
			})
			.end(function(e, res){
				// console.log(res.body);
				expect(e).to.eql(null);
				expect(typeof res.body).to.eql('object');
				expect(res.body.msg).to.eql('success');
				done();
			});
	});

	it('Removes an object', function(done){
		superagent.del('http://localhost:3000/posts/'+id)
			.end(function(e, res){
				// console.log(res.body);
				expect(e).to.eql(null);
				expect(typeof res.body).to.eql('object');
				expect(res.body.msg).to.eql('success');
				done();
			});
	});
});
