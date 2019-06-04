//Declare const variables
const express = require("express");
const request = require("request");
const bodyParser =require("body-parser");
const PORT = 3000;
const app = express();



const campgrounds = [
	{name: "Réserve faunique de Port-Cartier-Sept-îles", image: "http://www.villeport-cartier.com/upload/villeport-cartier/editor/image/Chute%20MacDonald_JB%C3%A9langer%20(10).JPG" },
	{name: "Parc nationa d'Anticosti", image: "https://www.sepaq.com/resources/images/pq/pan/caroussel/ant_001.jpg" },
	{name: "Parc national de l'île-Bonnaventure-et-du-Rocher-Percé", image: "https://www.geoparcdeperce.com/wp-content/uploads/2019/05/geoparc_roche_perce_bonjour_gaspesie.jpg" },
];

//Define engine template for ejs
app.set("view engine", "ejs");

//Setting bodyParser
app.use(bodyParser.urlencoded({extended: true}));

//Define home page route
app.get("/", (req, res) => {
	res.render("index");
});

//Define get campings route
app.get("/campings", (req, res) => {
	res.render("campings", {campgrounds: campgrounds});
});


//Define post campings route
app.post("/campings", (req, res) => {
	let newCamp = req.body.newCamp;
	let imgURL = req.body.imgURL;
	let newCampObj = {name: newCamp, image: imgURL};
	campgrounds.push(newCampObj);
	res.redirect("/campings");
});

//Define add new campground route
app.get("/campings/formulaire", (req, res) => {
	res.render("formulaire");
});

//Define port for server
app.listen(PORT, () => {
	console.log("The YelpCamp project server listen on port 3000");
});



