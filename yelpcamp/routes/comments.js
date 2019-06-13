const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');

//COMMENTS ROUTES ===================================================================================
//Comment new - Show the form to make new comment, associated with a paricular campground
router.get("/new", isLoggedIn, (req, res) =>{
	Campground.findById(req.params.id, (err, campgrounds)=> {
		if(err){
			console.log("Cannot find the comments form associated with this campground.");
			console.log("Index comments Error: " + err);
		} else {
			res.render("comments/new", {campgrounds: campgrounds});
		}
	});
});

//Comment create - Send the data from the comment form associated with a particular campground
router.post("/", isLoggedIn, (req, res) =>{
	Campground.findById(req.params.id, (err, campgrounds) => {
		if(err){
			console.log("Cannot receive your comment on this campground.");
			console.log("index post comment Error: " + err);
			res.redirect("/index");
		} else {
			Comment.create(req.body.comment, (err, comment) => {
				if(err){
					console.log("Cannot post your comment on this campground.");
					console.log("index post comment Error: " + err);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.author.email = req.user.email;
					comment.save();
					campgrounds.comments.push(comment);
					campgrounds.save();
					res.redirect("/index/" + campgrounds._id);
				}
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

module.exports = router;