const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');
const nodeGeocoder = require('node-geocoder');

const options = {
	provider: 'google',
	httpAdapter: 'https',
	apiKey: process.env.GEOCODER_API_KEY,
	formatter: null
};

const geocoder = nodeGeocoder(options);


//INDEX OF CAMPGROUNDS ROUTES ===================================================================================
//INDEX - Show all campgrounds from DB and if necessary, research a specific campground
router.get("/", (req, res) => {
	//research a specific campground
	if(req.query.search){
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		Campground.find({$or:[{name: regex}, {location: regex}, {"author.username":regex}]}, (err, allCamps) => {
			if(err){
				console.log("Get index to show all camps Error : " + err);
			} else {
				if(allCamps.length < 1){
					req.flash("error", "Aucun campgin ne correspond à cette recherche, essayez à nouveau."); 
					return res.redirect('back');
				}
				res.render("campgrounds/index", {campgrounds: allCamps, page: 'index'});
			}
		});
	} else {
		//research all campgrounds
		Campground.find({}, (err, allCamps) => {
			if(err){
				console.log("Get index to show all camps Error : " + err);
			} else {
				res.render("campgrounds/index", {campgrounds: allCamps, page: 'index'});
			}
		});
	}
});


//Define POST campings route 
//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, (req, res) => {
	//Get data from form and create an campground object
	let newCamp = req.body.newCamp;
	let imgURL = req.body.imgURL;
	let description = req.body.description;
	let price = req.body.price;
	let author = {
		id: req.user._id,
		username: req.user.username,
		email: req.user.email
	};
	
	geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
		console.log("geocoder error : " + err);
      	req.flash('error', 'Adresse invalide');
      	return res.redirect('back');
    }
    let lat = data[0].latitude;
    let lng = data[0].longitude;
    let location = data[0].formattedAddress;
	
	let newCampObj = {name: newCamp, image: imgURL, description: description, price: price, author: author, location: location, lat: lat, lng: lng};
	
	//Create the campground and add it to DB
	Campground.create(newCampObj, (err, newCamp) => {
		if(err){
			console.log("Cannot add this campground to db : " + err);
		} else {
			res.redirect("/index");
		}
	});
});
});


//NEW - Show form to create a new campground
router.get("/formulaire", middleware.isLoggedIn, (req, res) => {
	res.render("campgrounds/formulaire");
});


//SHOW - Show info about a particular campground
router.get("/:id", (req, res) => {
	Campground.findById(req.params.id).populate("comments").exec( (err, foundCampground) =>{
		if(err || !foundCampground){
			console.log("Cannot show this particular campground: " + err);
			req.flash("error", "Nous n'avons pas trouvé ce camping dans notre base de données.");
			res.redirect("/index");
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
	
	geocoder.geocode(req.body.location, function (err, data) {
		if(err || !data.length){
			console.log(err.message);
			req.flash('error', 'Adresse invalide' + err.message);
			return res.redirect('back');
		}

		// assign the lat, lng, and formatted address to req.body.campground
		req.body.campground.location = data[0].formattedAddress;
		req.body.campground.lat = data[0].latitude;
		req.body.campground.lng = data[0].longitude;
	
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) =>{
		if(err){
			console.log("Cannot update this campground" + err);
			req.flash("error", "Nous n'avons pas trouvé ce camping dans notre base de données." + err.message);
			res.redirect("/index");
		} else {
			req.flash('success', "Les informations concernant ce camping ont été mises à jour");
			res.redirect("/index/" + updatedCampground._id);
		}
	});
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
				}
				req.flash("success", "Ce camping a été effacé.");
				res.redirect("/index");
			});
		}
	});
});

function escapeRegex(text){
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");	
}

module.exports = router;