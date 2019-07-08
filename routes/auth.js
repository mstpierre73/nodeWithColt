const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Campground = require('../models/campground');
const async = require('async');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


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
	if(req.body.adminCode === process.env.ADMIN_CODE){
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

//Forgot password get route, got to form to send an email to user
router.get("/forgot", (req, res)=>{
	res.render("forgot");
});

//Forgot password post route, got to the reset password form
router.post("/forgot", (req, res, next)=>{
	async.waterfall([
		function(done){
			crypto.randomBytes(20, (err, buf)=>{
				let token = buf.toString("hex");
				done(err, token);
			});
		},
		
		function(token, done){
			User.findOne({email: req.body.email}, (err, user)=>{
				if(!user){
					req.flash('error', "Il n'y a pas de compte avec cette adresse courriel");
					return res.redirect("/forgot");
				}
				
				user.resetPasswordToken = token;
				user.resetPasswordExpires = Date.now() + 3600000; 
				
				user.save((err)=>{
					done(err, token, user);
				});
			});	
		},
		
		function(token, user, done){
			let smtpTransport = nodemailer.createTransport({
				service: 'Gmail',
				auth: {
					user: process.env.GMAILADD,
					pass: process.env.GMAILPW
				}
			});
			
			let mailOptions = {
				to: user.email,
				from: process.env.GMAILADD,
				subject: 'Mofidier votre mot de passe sur CampiFav',
				text: 'Vous recevez ce message car vous (ou une autre personne) avez fait une demande de modification de votre mot de passe sur CampiFav.' + ' \n\n ' + 
				'Cliquez sur le lien suivant ou copiez celui-ci dans votre navigateur, pour compléter le processus: ' + ' \n ' +
				'http://' + req.headers.host + '/reset/' + token + ' \n\n ' +
				"Si vous n'avez pas fait cette demande, ignorez ce message et votre mot de passe demeurera inchangé. " + ' \n\n ' +
				"Vous avez une heure pour modifier votre mot de passe avant l'expiration de votre code d'accès."
			};
			smtpTransport.sendMail(mailOptions, (err)=>{
				req.flash("success", "Un courriel a été envoyé a " + user.email + " avec des instructions pour modifier le mot de passe. " + "Vous avez une heure pour modifier celui-ci avant l'expiration du code d'accès.");
				done(err, 'done');
			});
		}
	], (err)=>{
		if(err) return next(err);
		res.redirect("/forgot");
	});
});

//Reset get route to show the reset form
router.get("/reset/:token", (req, res)=>{
	User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, (err, user)=>{
		if(!user){
			req.flash('error', 'Le code de modification du mot de passe est invalide ou expiré.');
			return res.redirect("/forgot");
		}
		res.render('reset', {token: req.params.token});
	});
});

//Reset post route to accept and send new password to DB
router.post("/reset/:token", (req, res)=>{
	async.waterfall([
		function(done){
			User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, (err, user)=>{
				if(!user){
					req.flash('error', 'Le code de modification du mot de passe est invalide ou expiré.' );
					return res.redirect('back');
				}
				if(req.body.password ===req.body.confirm){
					user.setPassword(req.body.password, (err)=>{
						user.resetPasswordToken = undefined;
						user.resetPasswordExpires= undefined;
						
						user.save((err)=>{
							req.logIn(user, (err)=>{
								done(err, user);
							});
						});
					});
				} else {
					req.flash('error', 'Le mot de passe ne correspond pas.');
					return res.redirect('back');
				}
			});
		},
		
		function(user, done){
			let smtpTransport = nodemailer.createTransport({
				service: 'Gmail',
				auth: {
					user: process.env.GMAILADD,
					pass: process.env.GMAILPW 
				}
			});
			
			let mailOptions = {
				to: user.email,
				from: process.env.GMAILADD,
				subject: "Votre mot de passe a été changé.",
				text: "Bonjour, \n\n" + 
				"Ce message est une confirmation que votre mot de passe pour votre compte " + user.email + " vient d'être changé. \n"
			};
			
			smtpTransport.sendMail(mailOptions, (err)=>{
				req.flash('success', "Votre mot de passe a été changé.");
				done(err);
			});
		}
	], (err)=>{
		res.redirect("/index");
	});
});

module.exports = router;