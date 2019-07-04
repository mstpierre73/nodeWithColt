//setting constants variables
const express = require("express");
const app = express();
const PORT = 3000;
const bodyParser = require("body-parser");

//telling server we will use ejs
app.set("view engine", "ejs");

//telling the server we will use body-parser
app.use(bodyParser.urlencoded({extended: true}));

//telling server where to fin statics files
app.use(express.static("public"));

//Defining data to be used by all routes
const friends = ["Sophie", "Anne-Marie", "Simon", "Jean-Pierre"];

//Creating homepage route
app.get("/", function (req, res){
	res.render("home");
});

//Creating route for friends page
app.get("/friends", function(req, res){
	res.render("friends", {friends: friends});
});

//Creating route for Post Request
app.post("/addFriends", function(req, res){
	let newFriend = (req.body.newfriend);
	friends.push(newFriend);
	res.redirect("/friends");
});


//Setting server to listen on port 3000
app.listen(process.env.PORT || PORT, function(){
	console.log("The PortRequestDemo server is listening on port 3000");
});

	
	
	
