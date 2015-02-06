/*
 * Posts schema
 */

var mongoose = require("mongoose");

var schema = new mongoose.Schema({
	title: {
		type: String,
		//required: true
	},
	content: {
		type: String,
		//required: true
	},
	created_by: {
		type: mongoose.Schema.ObjectId,
		//required: true
	},
	created_at: {
		type: Date,
		default: Date.now
	}
},{collection:'posts'});

schema.static.getAll = function(fn){
	this.find({},fn);
};

schema.static.getById = function(id, fn){
	this.find({ _id : id }, fn);
};

schema.static.getAllByUser = function(userid, fn){
	this.find({ created_by : userid }, fn);
};

module.exports = mongoose.model('Posts', schema);
