//Declare const variables
const express = require("express");
const app = express();
const bodyParser =require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local");
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');
const seedDB = require('./seeds');
const PORT = 3000;


//APP SETTINGS ========================================================================================

//connect to the Database and update for some deprecation warning
mongoose.connect("mongodb://localhost:27017/yelpcamp", {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);

//Setting bodyParser to get info from forms
app.use(bodyParser.urlencoded({extended: true}));

//Define engine template for ejs
app.set("view engine", "ejs");

//Define the path to custom stylesheets
app.use(express.static(__dirname + "/public"));

//Run seedDB when server start remove all items from DB and repopulate with basic testing datas
seedDB();

//Passport configuration
app.use(require('express-session')({
	secret: "This is my first true complex app!",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Define a middleware
app.use((req, res, next)=>{
	res.locals.currentUser = req.user;
	next();
});

// APP ROUTES ======================================================================================

//Define home page route
app.get("/", (req, res) => {
	res.render("home");
});


//Define GET campings route 
//INDEX - Show all campgrounds from DB
app.get("/index", (req, res) => {
	Campground.find({}, (err, allCamps) => {
		if(err){
			console.log("Houston, we've got a problem! Cannot show index of all campgrounds.");
			console.log("Get index Error : " + err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCamps});
		}
	});
});


//Define POST campings route 
//CREATE - add new campground to DB
app.post("/index", isLoggedIn, (req, res) => {
	let newCamp = req.body.newCamp;
	let imgURL = req.body.imgURL;
	let description = req.body.description;
	let newCampObj = {name: newCamp, image: imgURL, description: description};
	Campground.create(newCampObj, (err, newCamp) => {
		if(err){
			console.log("Cannot add this campground to db");
			console.log("Index Post Error : " + err);
		} else {
			res.redirect("/index");
		}
	});
});


//NEW - Show form to create a new campground
app.get("/index/formulaire", isLoggedIn, (req, res) => {
	res.render("campgrounds/formulaire");
});


//SHOW - Show info about a particular campground
app.get("/index/:id", (req, res) => {
	Campground.findById(req.params.id).populate("comments").exec( (err, foundCampground) =>{
		if(err){
			console.log("Cannot show this particular campground.");
			console.log("index Show Error: " + err);
		} else {
			res.render("campgrounds/show", {campgrounds: foundCampground});
		}
	});
});

//COMMENTS ROUTES ===================================================================================
//Show the form to make new comment, associated with a paricular campground
app.get("/index/:id/comments/new", isLoggedIn, (req, res) =>{
	Campground.findById(req.params.id, (err, campgrounds)=> {
		if(err){
			console.log("Cannot find the comments form associated with this campground.");
			console.log("Index comments Error: " + err);
		} else {
			res.render("comments/new", {campgrounds: campgrounds});
		}
	});
});

//Send the data from the comment form associated with a particular campground
app.post("/index/:id/comments", isLoggedIn, (req, res) =>{
	Campground.findById(req.params.id, (err, campgrounds) => {
		if(err){
			console.log("Cannot receive your comment on this campground.");
			console.log("index post comment Error: " + err);
			res.redirect("/index");
		} else {
			Comment.create(req.body.comment, (err, comment) => {
				if(err){
					console.log("Cannot post your comment on this campground.");
					console.log("index post comment Error: " + err);
				} else {
					campgrounds.comments.push(comment);
					campgrounds.save();
					res.redirect("/index/" + campgrounds._id);
				}
			});
		}
	});
});

//AUTHENTICATION ROUTES======================================================================================

//Show the signUp form
app.get("/register", (req, res) =>{
	res.render("register");
});

//get data from the signUp form
app.post("/register", (req, res) =>{
	let newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user)=>{
		if(err){
			console.log("cannot receive data from the signUp form");
			console.log("SignUp form Error: " + err);
			return res.render("register");
		} 
		passport.authenticate("local")(req, res, ()=>{
			res.redirect("/index");
		});
	});
});

//Show the login form
app.get("/login", (req, res) =>{
	res.render("login");
});

//get data from the signUp form
app.post("/login", passport.authenticate("local", 
	{successRedirect: "/index", failureRedirect: "/login"}),
	(req, res) =>{});

//Show the logout page
app.get("/logout", (req, res) =>{
	req.logout();
	res.redirect("/index");
});

//CREATE MIDDLEWARE===================================================================================

//function to check if user is logged in
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}



//SERVER LISTENING ===================================================================================

//Define port for server to listen
app.listen(PORT || process.env.PORT, process.env.IP, () => {
	console.log("The YelpCamp project server listen on port 3000");
});

