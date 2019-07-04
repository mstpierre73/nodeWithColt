const mongoose = require('mongoose');

//setting up the DB with code to prevent deprecation warning
mongoose.connect('mongodb://localhost:27017/blog', {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);

//POST - Title, image, body and date
const blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

const Blog = mongoose.model("Blog", blogSchema);

//USER - email, name
const userSchema = new mongoose.Schema({
	email: String,
	name: String,
	posts: [blogSchema]
});

const User = mongoose.model("User", userSchema);

//Create a new user
/*
let newUser = new User({
	email: "harry@potter.edu",
	name: "Harry Potter"
});

newUser.posts.push({
	title: "How to brew polyjuice potion",
	image: "https://images.unsplash.com/photo-1510759591315-6425cba413fe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
	body: "Just kidding. Go to potions class to learn it!"
});

newUser.save((err, user) =>{
	if(err){
		console.log(err);
	} else {
		console.log(user);
	}
});
*/

//Create a new blog post
User.findOne({name: "Harry Potter"}, (err, user)=>{
	if(err){
		console.log(err);
	} else {
		user.posts.push({
			title: "3 things I really hate",
			image: "https://images.unsplash.com/photo-1545062990-4a95e8e4b96d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
			body: "Voldemort. Voldemort. Voldemort"
		});
		user.save((err, user)=>{
			if(err){
				console.log(err);
			} else {
				console.log(user);
			}
		});
	}
});

/*
let newBlog = new Blog({
	title: "Reflections on Apples",
	image: "https://images.unsplash.com/photo-1513677785800-9df79ae4b10b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
	body: "They are delicious",
}); 

newBlog.save((err, post) =>{
	if(err){
		console.log(err);
	} else {
		console.log(post);
	}
});
*/
