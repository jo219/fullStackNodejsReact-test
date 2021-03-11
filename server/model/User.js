const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		min: 6,
		max: 255,		
	},
	password: {
		type: String,
		required: true,
		min: 6,
		max: 1024,
	},
	name: {
		type: String,
		required: true,
		min: 6,
		max: 255,
	},
	role: {
		type: String,
		required: true,
		min: 4,
		max: 255,
	},
	address: {
		type: String,
		required: true,
		min: 6,
		max: 255,
	},
	phone: {
		type: String,
		min: 10,
		max: 20
	},
});

module.exports = mongoose.model('User', userSchema);