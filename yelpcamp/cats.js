//Create const variable to set the data base and correct deprecation
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/cat_app", {useNewUrlParser: true});

//Create a schema for our cats objects
const catSchema = new mongoose.Schema({
	name: String,
	age: Number,
	temperament: String
});

const Cat = mongoose.model("Cat", catSchema);

//Add a cat in the db
/*
const George = new Cat({
	name: "George",
	age: 11,
	temperament: "Grouchy" 
});

const Mona = new Cat({
	name: "Mona",
	age: 3,
	temperament: "Speedy" 
});

Mona.save(function(err, item){
	if(err){
		console.log("Something is wrong!");
	} else {
		console.log("A new cat added to db");
		console.log(item);
	}
});*/

Cat.create({
	name: "Mrs. Norris",
	age: 7,
	temperament: "Evil"
}, function(err, item){
	if(err){
		console.log(err);
	} else {
		console.log(item);
	}
});

//Retreive info from the db

Cat.find({}, function(err, items){
	if(err){
		console.log("Houston, we've got a problem!");
		console.log(err);
	} else {
		console.log("All cats in the DB");
		console.log(items);
	}
});
