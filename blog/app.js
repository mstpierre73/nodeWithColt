const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const request = require('request');
const PORT = 3000;
const app = express();

//setting up the DB
mongoose.connect('mongodb://localhost:27017/blog', {useNewUrlParser: true});

//Allow templating using ejs
app.set('view engine', 'ejs');

//Allow the use of statics files for CSS
app.use(express.static('public'));

//Allow the use of body-parser
app.use(bodyParser.urlencoded({extended: true}));

//Setting db schema with mongoose
const blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

const Blog = mongoose.model("Blog", blogSchema);

//RESTFUL ROUTES

//INDEX
app.get("/", (req, res) =>{
	res.redirect("/blogs");
});

app.get("/blogs", (req, res) => {
	Blog.find({}, (err, blogs) => {
		if(err){
			console.log(err);
		} else {
			res.render("index", {blogs: blogs});
		}	  
		});
		
});

//NEW ROUTE
app.get("/blogs/new", (req, res) => {
	res.render("new");
});

//CREATE ROUTE
app.post("/blogs", (req, res) => {
	Blog.create(req.body.blog, (err, newBlog) => {
		if(err){
			res.render('new');
		} else {
			res.redirect("/blogs");
		}
	});
});


//SHOW ROUTE
app.get("/blogs/:id", (req, res) => {
	Blog.findById(req.params.id, (err, foundBlog) =>{
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("show", {blog: foundBlog});
		}
	});
});

//setting the server on port 3000
app.listen(PORT, () => {
	console.log("The blog server is running on port 3000.");
});



