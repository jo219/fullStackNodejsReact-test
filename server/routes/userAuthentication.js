const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { registerValidation, loginValidation } = require('../validation');

router.post('/signup', async (req, res) => {
	const { error } = registerValidation(req.body);
	if(error) return res.status(400).send(error.details[0].message);

	try {
		const emailExist = await User.findOne({email: req.body.email});
		if(emailExist) return res.status(400).send('Email ' + emailExist.email + ' already exist');
	} catch(error) {
		return res.status(400).send(error);
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
			email: req.body.email,
			password: hashedPassword,
			name: req.body.name,
			role: req.body.role,
			address: req.body.address,
			phone: req.body.phone,
	});

	try {
		const savedUser = await user.save();
	    res.send('The activation email for new id:' + savedUser._id + ' has been sent to ' + savedUser.email + ', please click the activation link within 24 hours.');
	} catch(err) {
		res.status(400).send(err);
	}
});

router.post('/signin', async (req, res) => {
	const { error } = loginValidation(req.body);
	if(error) return res.status(400).send(error.details[0].message);

	const user = await User.findOne({email: req.body.email});
	if(!user) return res.status(400).send('Email or password is wrong');

	const validPass = await bcrypt.compare(req.body.password, user.password);
	if(!validPass) return res.status(400).send('Invalid password');

	const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
	res.header('auth-token', token).send(token);
});


module.exports = router;