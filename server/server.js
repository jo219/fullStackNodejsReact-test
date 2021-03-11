const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require("path");
const userAuthentication = require('./routes/userAuthentication');
const mainPage = require('./routes/mainPage');

dotenv.config();

mongoose.connect(
	process.env.DB_CONNECT,
	{ useUnifiedTopology: true, useNewUrlParser: true },
	() => console.log('Connected to db!')
);

app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

// app.use((req, res, next) => {
//   res.sendFile(path.join(__dirname, "..", "build", "index.html"));
// });

app.use(express.json());
app.use('/premain', userAuthentication);
app.use('/main', mainPage);

app.listen(process.env.PORT || 5000, () => console.log('Server up and running'));