const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const moment = require('moment');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');
const PORT = 3000;
const app = express();

//setting up the DB with code to prevent deprecation warning
mongoose.connect('mongodb://localhost:27017/blog', {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);

//Allow templating using ejs
app.set('view engine', 'ejs');

//Allow the use of statics files for CSS
app.use(express.static('public'));

//Allow the use of body-parser
app.use(bodyParser.urlencoded({extended: true}));

//Allow the app to use method-override
app.use(methodOverride('_method'));

//Allow the app to use express-sanitizer
app.use(expressSanitizer());

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
	req.body.blog.body = req.sanitize(req.body.blog.body);
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

//EDIT ROUTE
app.get("/blogs/:id/edit", (req, res) => {
	Blog.findById(req.params.id, (err, foundBlog)=>{
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("edit", {blog: foundBlog});
		}
	});
});

//UPDATE ROUTE
app.put("/blogs/:id", (req, res) =>{
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

//DESTROY ROUTE
app.delete("/blogs/:id", (req, res) =>{
	Blog.findByIdAndRemove(req.params.id, (err) =>{
		if(err){
			console.log("Delete error: " + err);
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs");
		}
	});
});


//setting the server on port 3000
app.listen(PORT, () => {
	console.log("The blog server is running on port 3000.");
});



