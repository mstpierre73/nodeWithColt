//Declare const variables
const express = require("express");
const request = require("request");
const bodyParser =require("body-parser");
const mongoose = require("mongoose");
const PORT = 3000;
const app = express();

//Define engine template for ejs
app.set("view engine", "ejs");

//Setting bodyParser
app.use(bodyParser.urlencoded({extended: true}));

//connect the Database
mongoose.connect("mongodb://localhost:27017/yelpcamp", {useNewUrlParser: true});

//db schema setup
const campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

const Campground = mongoose.model("Campground", campgroundSchema);


//Define home page route
app.get("/", (req, res) => {
	res.render("home");
});


//Define GET campings route 
//INDEX - Show all campgrounds from DB
app.get("/index", (req, res) => {
	Campground.find({}, (err, allCamps) => {
		if(err){
			console.log("Houston, we've got a problem!");
			console.log("Get index Error : " + err);
		} else {
			res.render("index", {campgrounds: allCamps});
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
	res.render("formulaire");
});


//SHOW - Show info about a particular campground
app.get("/index/:id", (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) =>{
		if(err){
			console.log("index Show Error: " + err);
		} else {
			res.render("show", {campgrounds: foundCampground});
		}
	});
});


//Define port for server to listen
app.listen(PORT, () => {
	console.log("The YelpCamp project server listen on port 3000");
});

