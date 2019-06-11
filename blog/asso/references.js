const mongoose = require('mongoose');
const Post = require('../models/post');
const User = require('../models/user');

//setting up the DB with code to prevent deprecation warning
mongoose.connect('mongodb://localhost:27017/blog_2', {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);

//Create user
/*
User.create({
	email: "bob@gmail.com",
	name: "Bob Binette"
});

*/

//Create a post
/*
Post.create({
	title: "How to cook the best burger part 5",
	body: "It would be a miracle if this work!"
}, (err, post)=>{
	if(err){
		console.log(err);
	} else {
		User.findOne({email: "bob@gmail.com"}, (err, foundUser)=>{
			if(err){
				console.log(err);
			} else {
				foundUser.posts.push(post);
				foundUser.save((err, data)=>{
					if(err){
						console.log(err);
					} else {
						console.log(data);
					}
				});
			}
		});
		console.log(post);
	}
});
*/

//Find all posts from a user
/*
User.findOne({email: "bob@gmail.com"}).populate("posts").exec((err, user) =>{
	if(err){
		console.log(err);
	} else {
		console.log(user);
	}
});

*/