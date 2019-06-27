const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Campground = require('../models/campground');


// APP ROOT ROUTES ======================================================================================

//Define home page route
router.get("/", (req, res) => {
	res.render("home");
});


//AUTHENTICATION ROUTES======================================================================================

//Show the signUp form
router.get("/register", (req, res) =>{
	res.render("register", {page: "register"});
});

//get data from the signUp form
router.post("/register", (req, res) =>{
	
	let newUser = new User({
		username: req.body.username, 
		email:req.body.email,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		avatar: req.body.avatar
		});
	if(req.body.adminCode === 'secret123'){
		newUser.isAdmin = true;
	}
	User.register(newUser, req.body.password, (err, user)=>{
		if(err){
			console.log("cannot receive data from the signUp form: " + err);
			req.flash("error", "Nous n'avons pas pu effectuer votre enregistrement: " + err.message);
			return res.redirect("/register");
		} 
		passport.authenticate("local")(req, res, ()=>{
			req.flash("success", "Bienvenue à CampiFav, " + user.username + ", votre compte est activé.");
			res.redirect("/index");
		});
	});
});

//Show the login form
router.get("/login", (req, res) =>{
	res.render("login", {page: "login"});
});

//get data from the signUp form
router.post("/login", passport.authenticate("local", 
	{successRedirect: "/index", failureRedirect: "/login"}),
	(req, res) =>{});

//Show the logout page
router.get("/logout", (req, res) =>{
	req.logout();
	req.flash("success", "Vous êtes maintenant déconnecté de votre compte.");
	res.redirect("/index");
});

//User profile route
router.get("/users/:id", (req, res)=>{
	User.findById(req.params.id, (err, foundUser)=>{
		if(err){
			console.log("cannot find this user: " + err);
			req.flash("error", "Nous n'avons pas pu trouver cet  usager.");
			return res.redirect("/index");
		}
		Campground.find().where("author.id").equals(foundUser._id).exec((err, campgrounds)=>{
			if(err){
				console.log("cannot find campgrounds related to this user: " + err);
				req.flash("error", "Nous n'avons pas pu trouver les campings créés par cet usager.");
				return res.redirect("/index");					
			}
			res.render("users/show", {user: foundUser, campgrounds: campgrounds});	
		});
	});
});


module.exports = router;