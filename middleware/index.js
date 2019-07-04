const Campground = require('../models/campground');
const Comment = require('../models/comment');

const middlewareObj = {};
	
//function to check if a campground is linked to a particular user.
middlewareObj.checkCampgroundOwnership = function(req, res, next){
	//Is user logged in?
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, (err, foundCampground) =>{
			if(err || !foundCampground){
				req.flash("error", "Nous n'avons pas trouvé ce camping dans notre base de données.");
				res.redirect('back');
			} else{
				//Does this user created the campground? 
				if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
					next();
				} else {
					req.flash("error", "Vous n'êtes pas autorisé à faire cette modification.");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "Connectez-vous à votre compte pour faire cette opération.");
		res.redirect("/login");
	}
};

//function to check if a comment is linked to a particular user
middlewareObj.checkCommentOwnership = function (req, res, next){
	//Is user logged in?
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, (err, foundComment) =>{
			if(err || !foundComment){
				req.flash("error", "Nous n'avons pas trouvé ce commentaire dans notre base de données.");
				res.redirect('back');
			} else{
				//Does this user created the comment? 
				if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
					next();
				} else {
					req.flash("error", "Vous n'êtes pas autorisé à faire cette modification.");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "Connectez-vous à votre compte pour faire cette opération.");
		res.redirect("/login");
	}
};

//function to check if user is logged in	
middlewareObj.isLoggedIn = function (req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash('error', "Connectez-vous à votre compte pour faire cette opération.");
	res.redirect("/login");
};


module.exports = middlewareObj;