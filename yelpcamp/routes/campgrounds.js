const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');


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
	let author = {
		id: req.user._id,
		username: req.user.username,
		email: req.user.email
	};
	let newCampObj = {name: newCamp, image: imgURL, description: description, author: author};
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

//EDIT - show the edit campground form
router.get("/:id/edit", checkCampgroundOwnership, (req, res) =>{
	Campground.findById(req.params.id, (err, foundCampground) =>{
		if(err){
			res.redirect("/index");
		} else {
			res.render("campgrounds/edit", {campgrounds: foundCampground});	
		}
	});
});

//UPDATE - submit the edit form
router.put("/:id/", checkCampgroundOwnership, (req, res) =>{
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) =>{
		if(err){
			console.log("Cannot update this campground" + err);
			res.redirect("/index");
		} else {
			res.redirect("/index/" + req.params.id);
		}
	});
});

//DELETE campground
router.delete("/:id", checkCampgroundOwnership, (req, res) =>{
	Campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved)=>{
		if(err){
			console.log(err);
			res.redirect("/index");
		} else {
			Comment.deleteMany({_id: {$in: campgroundRemoved.comments}}, (err)=>{
				if(err){
					console.log(err);
				}
				res.redirect("/index");
			});
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

//function to check if a campground is linked to a particular user.
function checkCampgroundOwnership(req, res, next){
	//Is user logged in?
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, (err, foundCampground) =>{
			if(err){
				console.log("cannot show edit form" + err);
				console.log("cannot show the edit form for this particular campground");
				res.redirect('back');
			} else{
				//Does this user created the campground? 
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				} else {
					res.redirect("back");
				}
			}
		});
	} else {
		res.redirect("/login");
	}
}


module.exports = router;