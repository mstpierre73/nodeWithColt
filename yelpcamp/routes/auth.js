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
	res.render("register");
});

//get data from the signUp form
router.post("/register", (req, res) =>{
	let newUser = new User({username: req.body.username, email:req.body.email});
	User.register(newUser, req.body.password, (err, user)=>{
		if(err){
			console.log("cannot receive data from the signUp form");
			console.log("SignUp form Error: " + err);
			return res.render("register");
		} 
		passport.authenticate("local")(req, res, ()=>{
			res.redirect("/index");
		});
	});
});

//Show the login form
router.get("/login", (req, res) =>{
	res.render("login");
});

//get data from the signUp form
router.post("/login", passport.authenticate("local", 
	{successRedirect: "/index", failureRedirect: "/login"}),
	(req, res) =>{});

//Show the logout page
router.get("/logout", (req, res) =>{
	req.logout();
	res.redirect("/index");
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