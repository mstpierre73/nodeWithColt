const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');


//INDEX OF CAMPGROUNDS ROUTES ===================================================================================
//INDEX - Show all campgrounds from DB
router.get("/", (req, res) => {
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
router.post("/", isLoggedIn, (req, res) => {
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
router.get("/formulaire", isLoggedIn, (req, res) => {
	res.render("campgrounds/formulaire");
});


//SHOW - Show info about a particular campground
router.get("/:id", (req, res) => {
	Campground.findById(req.params.id).populate("comments").exec( (err, foundCampground) =>{
		if(err){
			console.log("Cannot show this particular campground.");
			console.log("index Show Error: " + err);
		} else {
			res.render("campgrounds/show", {campgrounds: foundCampground});
		}
	});
});

//CREATE MIDDLEWARES===================================================================================
//function to check if user is logged in
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;