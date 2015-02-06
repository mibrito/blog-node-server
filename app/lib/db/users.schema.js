/*
* user.schema.js
* Users schema
*/

var mongoose = require("mongoose");
var bcrypt   = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

var userSchema = Schema({
	local: {
		email		: String,
		password	: String,
		linked_at	: { type : Date },
		unlinked_at	: { type : Date }
	},
	google: {
		id		: String,
		token		: String,
		email		: String,
		name		: String,
		linked_at	: { type : Date },
		unlinked_at	: { type : Date }
	},
	twitter: {
		id		: String,
		token		: String,
		displayName	: String,
		username	: String,
		linked_at	: { type : Date },
		unlinked_at	: { type : Date }
	},
	facebook: {
		id		: String,
		token		: String,
		profileUrl	: String,
		name		: String,
		linked_at	: { type : Date },
		unlinked_at	: { type : Date }
	},
	created_at: { type : Date, default: Date.now }
},{collection:'users'});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

// checking if the user is linked by any of these social media
userSchema.methods.unlinked = function() {
	console.log("L:"+this.local.unlinked_at+" G:"+this.google.unlinked_at+" T:"+this.twitter.unlinked_at+" F:"+this.facebook.unlinked_at);
	return	( this.local.unlinked_at	|| this.local.unlinked_at	=== undefined ) &&
		( !this.google.token ) &&
		( !this.twitter.token ) &&
		( !this.facebook.token );
};

module.exports = mongoose.model('users', userSchema);
