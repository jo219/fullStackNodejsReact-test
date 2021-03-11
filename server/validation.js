const Joi = require('joi');

const registerValidation = data => {
	const schema = Joi.object({
		email: Joi.string().min(6).required().email(),
		password: Joi.string().min(6).required(),
		name: Joi.string().min(6).required(),
		role: Joi.string().min(4).required(),
		address: Joi.string().min(6).required(),
		phone: Joi.string().min(6).required(),
	});
	return schema.validate(data);
};

const loginValidation = data => {
	const schema = Joi.object({
		email: Joi.string().min(6).required().email(),
		password: Joi.string().min(6).required(),
	});
	return schema.validate(data);
};

const createInvoiceValidation = data => {
	const schema = Joi.object({
		customer: Joi.string().min(6).required(),
		items: Joi.array().min(1).required(),
		total: Joi.number().required(),
	})
	return schema.validate(data);
}


module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.createInvoiceValidation = createInvoiceValidation;
