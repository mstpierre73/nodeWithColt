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
app.use(bodyParser.urlencoded({extended: true}));
app.use(require('express-session')({
	secret: "It is hard to learn programming but I love it",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//ROUTES ==============================================================================

//Home page route
app.get("/", (req, res) =>{
	res.render("home");
});

//Secret route
app.get("/secret", isLoggedIn, (req, res) =>{
	res.render("secret");
});

//Auth signUp route - Show sign up form
app.get("/register", (req, res) =>{
	res.render("register");	
}); 

//Auth signUp route - send data from sign up form
app.post("/register", (req, res) =>{
	User.register(new User({username: req.body.username}), req.body.password, (err, user)=>{
		if(err){
			console.log(err);
			res.render('register');
		} else {
			passport.authenticate('local')(req, res, ()=>{
				res.redirect("/secret");
			});
		}
	});
});

//Auth login route - show login form
app.get("/login", (req, res)=>{
	res.render("login");
});

//Auth login route - send data from login form to passport middleware
app.post("/login", passport.authenticate('local', 
	{successRedirect: "/secret",
	failureRedirect: "/login"}),
	(req, res)=>{});

//Auth logout
app.get("/logout", (req, res)=>{
	req.logout();
	res.redirect("/");
});

//CREATE MIDDLEWARE=====================================================================

//function to check if user is logged in
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect("/login");
	}
}


//Start the server=======================================================================

app.listen(PORT || process.env.PORT, process.env.IP || LOCALHOST, () => {
	console.log("The server is listening on port 3000 with localhost 127.0.0.1");
});