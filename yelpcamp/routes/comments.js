const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');

//COMMENTS ROUTES ===================================================================================
//Comment new - Show the form to make new comment, associated with a paricular campground
router.get("/new", middleware.isLoggedIn, (req, res) =>{
	Campground.findById(req.params.id, (err, campgrounds)=> {
		if(err){
			console.log("Cannot show the form to edit comment: " + err);
			req.flash("error", "Nous n'avons pas trouvé ce camping dans notre base de données.");
			res.redirect("/index");
		} else {
			res.render("comments/new", {campgrounds: campgrounds});
		}
	});
});

//Comment create - Send the data from the comment form associated with a particular campground
router.post("/", middleware.isLoggedIn, (req, res) =>{
	Campground.findById(req.params.id, (err, campgrounds) => {
		if(err){
			console.log("Cannot receive your comment on this campground: " + err);
			req.flash("error", "Nous n'avons pas trouvé ce camping dans notre base de données.");
			res.redirect("/index");
		} else {
			Comment.create(req.body.comment, (err, comment) => {
				if(err){
					console.log("Cannot post your comment on this campground: " + err);
					req.flash("error", "Nous n'avons pas pu ajouter votre commentaire.");
					res.redirect("/index");
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.author.email = req.user.email;
					comment.save();
					campgrounds.comments.push(comment);
					campgrounds.save();
					req.flash("success", "Votre commentaire a été ajouté." );
					res.redirect("/index/" + campgrounds._id);
				}
			});
		}
	});
});

//EDIT COMMENT FORM
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) =>{
	Comment.findById(req.params.comment_id, (err, foundComment) =>{
		if(err){
			console.log("Cannot show the edit form " + err);
			req.flash("error", "Nous n'avons pas trouvé ce commentaire dans notre base de données.");
			res.redirect("back");
		} else {
			res.render("comments/edit", {campgrounds_id: req.params.id, comment: foundComment});
		}
	});
});

//UPDATE COMMENT ROUTES
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) =>{
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) =>{
		if(err){
			console.log("Cannot update this comment" + err);
			req.flash("error", "Nous n'avons pas trouvé ce commentaire dans notre base de données.");
			res.redirect("back");
		} else {
			res.redirect("/index/" + req.params.id);
		}
	});
});

//DELETE COMMENT
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
	Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
		if(err){
			console.log("Cannot delete this comment: " + err);
			req.flash("error", "Nous n'avons pas trouvé ce commentaire dans notre base de données.");
			res.redirect("back");
		} else {
			req.flash("success", "Ce commentaire a été effacé.");
			res.redirect("/index/" + req.params.id);
		}
	});
});

module.exports = router;