const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const invoiceSchema = new mongoose.Schema({
	date: {
		type: Date,
		default: Date.now,
	},
	customer: {
		type: String,
		required: true,
		min: 6,
		max: 255,
	},
	items: {
		type: Array, // {price: <>, qty: <>},
		default:[],
	},
	total: {
		type: Number,
		required: true,
	},
});

invoiceSchema.plugin(AutoIncrement, {inc_field: 'id'});


module.exports = mongoose.model('Invoice', invoiceSchema);