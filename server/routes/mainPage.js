const router = require('express').Router();
const User = require('../model/User');
const Invoice = require('../model/Invoice');
const { createInvoiceValidation } = require('../validation');

router.get('/userInfo/:email', async (req, res) => {
	try {
		const emailExist = await User.findOne({email: req.params.email});
		if(emailExist) {
			// delete emailExist['password'];
			emailExist.password = '';
			return res.json(emailExist);
		} else {
			return res.status(400).send('Email ' + emailExist.email + 'does not exist');
		}
	} catch(error) {
		return res.status(400).send(error);
	}
});

router.get('/lastInvoiceId', async(req, res) => {
	try {
		const lastInvoice = await Invoice.find().sort({"date": -1}).limit(1);
		if(lastInvoice) {
			return res.json({id: lastInvoice[0].id});
		} else {
			return res.json({id: 0});
		}
	} catch(error) {
		return res.status(400).send(error);
	}
});

router.post('/newInvoice', async (req, res) => {

	const { error } = createInvoiceValidation(req.body);
	if(error) return res.status(400).send(error.details[0].message);
	
    const invoice = new Invoice({
		customer: req.body.customer,
		items: req.body.items,
		total: req.body.total	
	});

	try {
		const savedInvoice = await invoice.save();
	    res.send('Invoice '+ savedInvoice.id +' already recorded');
	} catch(error) {
		console.log(error);
		res.status(400).send(error);
	}
});

router.get('/getLastTwenty', async (req, res) => {
	try {
		const lastInvoices = await Invoice.find().sort({"date": -1}).limit(20);
		if(lastInvoices) {
			return res.json(lastInvoices);
		} else {
			return res.status(400).send("The list is empty or there is another error");
		}
	} catch(error) {
		console.log(error);
		return res.status(400).send(error);
	}
});

router.get('/getByUser', async (req, res) => {
	try {
		const lastInvoices = await User.aggregate([
			{ $lookup: {
				from: Invoice.collection.name,
				as: "invoices",
				let: {customer_name: '$name'},
				pipeline: [
					{$match: {$expr: {$eq: ['$customer', '$$customer_name']}}},
					{$sort: {'date': -1}},
					{$limit: 1},
					{$project: {_id:0, id:1, date:1, total:1}}
				]
			}},
			{ $project: {_id:0, name:1, phone:1, invoices:1}},
			{ $unwind: '$invoices'},
			{ $unwind: {path: '$invoices'}}
		]);
		if(lastInvoices) {
			return res.json(lastInvoices);
		} else {
			return res.status(400).send("The list is empty or there is another error");
		}
	} catch(error) {
		console.log(error);
		return res.status(400).send(error);
	}
});

router.delete('/invoiceDelete/:id', async (req, res) => {
	console.log("here1");
	try {
		const curInvoice = await Invoice.findOne({id: req.params.id});
		if(curInvoice) {
			await Invoice.deleteOne({id: req.params.id});
			return res.status(200).send('Invoice successfully deleted');
		} else {
			return res.status(400).send('Invoice with id: IV ' + req.params.id + 'does not exist');
		}
	} catch(error) {
		console.log(error);
		return res.status(400).send(error);
	}
});

module.exports = router;