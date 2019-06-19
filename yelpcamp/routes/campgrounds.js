const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');


//INDEX OF CAMPGROUNDS ROUTES ===================================================================================
//INDEX - Show all campgrounds from DB
router.get("/", (req, res) => {
	Campground.find({}, (err, allCamps) => {
		if(err){
			console.log("Get index to show all camps Error : " + err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCamps});
		}
	});
});


//Define POST campings route 
//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, (req, res) => {
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
			console.log("Cannot add this campground to db : " + err);
		} else {
			res.redirect("/index");
		}
	});
});


//NEW - Show form to create a new campground
router.get("/formulaire", middleware.isLoggedIn, (req, res) => {
	res.render("campgrounds/formulaire");
});


//SHOW - Show info about a particular campground
router.get("/:id", (req, res) => {
	Campground.findById(req.params.id).populate("comments").exec( (err, foundCampground) =>{
		if(err){
			console.log("Cannot show this particular campground: " + err);
		} else {
			res.render("campgrounds/show", {campgrounds: foundCampground});
		}
	});
});

//EDIT - show the edit campground form
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) =>{
	Campground.findById(req.params.id, (err, foundCampground) =>{
		if(err){
			console.log("Cannot show the edit form " + err);
			req.flash("error", "Nous n'avons pas trouvé ce camping dans notre base de données.");
			res.redirect("/index");
		} else {
			res.render("campgrounds/edit", {campgrounds: foundCampground});	
		}
	});
});

//UPDATE - submit the edit form
router.put("/:id/", middleware.checkCampgroundOwnership, (req, res) =>{
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) =>{
		if(err){
			console.log("Cannot update this campground" + err);
			req.flash("error", "Nous n'avons pas trouvé ce camping dans notre base de données.");
			res.redirect("/index");
		} else {
			res.redirect("/index/" + req.params.id);
		}
	});
});

//DELETE campground
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) =>{
	Campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved)=>{
		if(err){
			console.log("Cannot delete this campground: " + err);
			req.flash("error", "Nous n'avons pas trouvé ce camping dans notre base de données.");
			res.redirect("/index");
		} else {
			Comment.deleteMany({_id: {$in: campgroundRemoved.comments}}, (err)=>{
				if("Cannot delete comments associated with this camp : " + err){
					console.log(err);
				}
				req.flash("success", "Ce camping a été effacé.");
				res.redirect("/index");
			});
		}
	});
});


module.exports = router;