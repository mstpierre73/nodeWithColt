//Using Express
const express = require("express");
const app = express();

//Defining my routes

//serving homepage
app.get("/", function(request, response){
	response.send("Hi there! This is really functionning!");
});

//serving goodbye page
app.get("/bye", function(req, res){
	res.send("Goodbye!");
});

//serving hello page
app.get("/hello", function(req, res){
	console.log("someone hit the hello page");
	res.send("Hello World!");
});

//serving routes according to a pattern with params
app.get("/r/:pageContent", function(req, res){
	res.send("Welcome to dynamique routing!");
});

//Serving more complex patterns and rendering dynamic content
app.get("/r/:pageContent/comments/:id/:title/", function(req, res){
	let pageContent = req.params.pageContent;
	let id = req.params.id;
	let title = req.params.title;
	res.send("Welcome to the page " + pageContent + " " + id + " " + title + " with a more complex routing");
});

//catching all others requests, the order matter, put it at the end
app.get("*", function(req, res){
	res.send("You just hit 404 error!");
});

//Tell Express to listen for request (start server), has showed by Colt
/*app.listen(process.env.PORT, process.env.IP, function(){
	console.log("server has started!");
});*/

//Tell Express to listen for request (start server). following Ian Instruction
app.listen(process.env.PORT || 3000, function(){
	console.log("My own server is listening on port 3000");
});




