//Declare const variables
require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser =require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local");
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');
const campgroundsRoutes = require('./routes/campgrounds');
const commentsRoutes = require('./routes/comments');
const authRoutes = require('./routes/auth');
const methodOverride = require('method-override');
const seedDB = require('./seeds');
const flash = require('connect-flash');
const PORT = 3000;


//APP SETTINGS ========================================================================================

//connect to the mongoDB (Atlas or local) and update for some deprecation warning

mongoose.connect(process.env.DB_URL, {
	useNewUrlParser: true,
	useFindAndModify: false,
	useCreateIndex: true
}).then(() =>{
	console.log("BD connected");
}).catch( err =>{
	console.log("Error: " + err.message);
});

//Setting bodyParser to get info from forms
app.use(bodyParser.urlencoded({extended: true}));

//Define engine template for ejs
app.set("view engine", "ejs");

//Define the path to custom stylesheets
app.use(express.static(__dirname + "/public"));

//define the use of method-override to make put and delete requests
app.use(methodOverride('_method'));

//Define the use of connect-flash for message to users
app.use(flash());

//Define the use of moment.js for creation of time stamp
app.locals.moment = require('moment');

//Run seedDB when server start remove all items from DB and repopulate with basic testing datas
//seedDB();

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



//CREATE MIDDLEWARES AND DEFINING ROUTES ===================================================================================

//Define a middleware to get user data before rendering every pages
app.use((req, res, next)=>{
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//requiring routes
app.use("/index", campgroundsRoutes);
app.use("/index/:id/comments", commentsRoutes);
app.use(authRoutes);


//SERVER LISTENING ===================================================================================

//Define port for server to listen
app.listen(process.env.PORT, process.env.IP, () => {
	console.log("The YelpCamp project server listen on port 3000");
});


