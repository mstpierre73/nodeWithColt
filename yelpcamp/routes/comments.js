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

//EDIT COMMENT FORM
router.get("/:comment_id/edit", checkCommentOwnership, (req, res) =>{
	Comment.findById(req.params.comment_id, (err, foundComment) =>{
		if(err){
			res.redirect("back");
		} else {
			res.render("comments/edit", {campgrounds_id: req.params.id, comment: foundComment});
		}
	});
});

//UPDATE COMMENT ROUTES
router.put("/:comment_id", checkCommentOwnership, (req, res) =>{
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) =>{
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/index/" + req.params.id);
		}
	});
});

//DELETE COMMENT
router.delete("/:comment_id", checkCommentOwnership, (req, res)=>{
	Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/index/" + req.params.id);
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

//function to check if a comment is linked to a particular user
function checkCommentOwnership(req, res, next){
	//Is user logged in?
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, (err, foundComment) =>{
			if(err){
				res.redirect('back');
			} else{
				//Does this user created the comment? 
				if(foundComment.author.id.equals(req.user._id)){
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