//Calling for express and defining the app
const express = require("express");
const app = express();
const port = 3000;

//Defining route for home page
app.get("/", (req, res) => {
	res.render("index.ejs");
});

//Defining a dynamic route and passing objet to add dynamic content
app.get("/love/:puppies", (req, res) => {
	let puppies = req.params.puppies;
	res.render("love.ejs", {puppies: puppies});
});

//Defining a dynamic route 
app.get("/posts", (req, res) => {
	let posts = [
		{title: "Meet my new baby", author: "Susy"},
		{title: "I don't like dogs", author: "Math"},
		{title: "Who made this pie ?", author: "Bianca"}
	];
	
	res.render("posts.ejs", {posts: posts});
});

//Starting the server on port 3000
app.listen(port, function(){
	console.log("The app is running on port 3000");
});


