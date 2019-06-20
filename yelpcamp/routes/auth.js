const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');


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
	let newUser = new User({username: req.body.username, email:req.body.email});
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


module.exports = router;