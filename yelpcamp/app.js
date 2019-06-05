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
	image: String
});

const Campground = mongoose.model("Campground", campgroundSchema);

/*Campground.create({
	name: "Réserve faunique de Port-Daniel",
	image: "https://www.quebecoriginal.com/fiche/images/800x600/9c2d51c1-d5bc-47b6-9fdc-cde1157b5dcd/reserve-faunique-de-port-daniel-chalet-lac-de-lile.jpg"
}, function (err, campground){
	if(err){
		console.log(err);
	} else {
		console.log("new campground added to db");
		console.log(campground);
	}
});*/


//Define home page route
app.get("/", (req, res) => {
	res.render("index");
});

//Define get campings route and get all campground from db
app.get("/campings", (req, res) => {
	Campground.find({}, function(err, allCamps){
		if(err){
			console.log("Houston, we've got a problem!");
			console.log("Error : " + err);
		} else {
			res.render("campings", {campgrounds: allCamps});
		}
	});
});


//Define post campings route and add new campground to db
app.post("/campings", (req, res) => {
	let newCamp = req.body.newCamp;
	let imgURL = req.body.imgURL;
	let newCampObj = {name: newCamp, image: imgURL};
	Campground.create(newCampObj, function(err, newCamp){
		if(err){
			console.log("Cannot add this campground to db");
			console.log("Error : " + err);
		} else {
			res.redirect("/campings");
		}
	});
});

//Define add new campground route
app.get("/campings/formulaire", (req, res) => {
	res.render("formulaire");
});

//Define port for server
app.listen(PORT, () => {
	console.log("The YelpCamp project server listen on port 3000");
});



