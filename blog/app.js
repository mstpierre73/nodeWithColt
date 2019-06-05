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
	image: {type: String, default: "https://images.unsplash.com/photo-1519659528534-7fd733a832a0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1226&q=80"},
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




//setting the server on port 3000
app.listen(PORT, () => {
	console.log("The blog server is running on port 3000.");
});



