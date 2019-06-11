//Declare const variables
const express = require("express");
const request = require("request");
const bodyParser =require("body-parser");
const mongoose = require("mongoose");
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const seedDB = require('./seeds');
const PORT = 3000;
const app = express();

//APP SETTINGS ========================================================================================

//connect the Database
mongoose.connect("mongodb://localhost:27017/yelpcamp", {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);

//Setting bodyParser
app.use(bodyParser.urlencoded({extended: true}));

//Define engine template for ejs
app.set("view engine", "ejs");

//Define custom stylesheets
app.use(express.static(__dirname + "/public"));

//Run seedDB when server start remove all items from DB and repopulate with basic testing datas
seedDB();


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
app.post("/index", (req, res) => {
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
app.get("/index/formulaire", (req, res) => {
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

app.get("/index/:id/comments/new", (req, res) =>{
	Campground.findById(req.params.id, (err, campgrounds)=> {
		if(err){
			console.log("Cannot find the comments associated with this campground.");
			console.log("Index comments Error: " + err);
		} else {
			res.render("comments/new", {campgrounds: campgrounds});
		}
	});
});

app.post("/index/:id/comments", (req, res) =>{
	Campground.findById(req.params.id, (err, campgrounds) => {
		if(err){
			console.log("Cannot post your comment on this campground.");
			console.log("index post comment Error: " + err);
			res.redirect("/index");
		} else {
			Comment.create(req.body.comment, (err, comment) => {
				if(err){
					console.log(err);
				} else {
					campgrounds.comments.push(comment);
					campgrounds.save();
					res.redirect("/index/" + campgrounds._id);
				}
			});
		}
	});
});


//SERVER LISTENING ===================================================================================

//Define port for server to listen
app.listen(PORT || process.env.PORT, process.env.IP, () => {
	console.log("The YelpCamp project server listen on port 3000");
});

