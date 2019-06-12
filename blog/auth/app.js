const express = require('express');
const PORT = 3000;
const LOCALHOST = 127001;
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const localStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const User = require('./models/user');


//Settings of the app
mongoose.connect('mongodb://localhost/secret', {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);
const app = express();
app.set('view engine', 'ejs');
app.use(require('express-session')({
	secret: "It is hard to learn programming but I love it",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//ROUTES ==============================================================================

//Home page route
app.get("/", (req, res) =>{
	res.render("home");
});

//Secret route
app.get("/secret", (req, res) =>{
	res.render("secret");
});


//Start the server=======================================================================

app.listen(PORT || process.env.PORT, process.env.IP || LOCALHOST, () => {
	console.log("The server is listening on port 3000 with localhost 127.0.0.1");
});