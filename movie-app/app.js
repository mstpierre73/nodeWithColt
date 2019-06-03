//creating const variables
const express = require('express');
const request = require('request');
const PORT = 3000;
const app = express();

//serving statics files likes CSS, img, etc.
app.use(express.static("public"));

//telling the server we use ejs files
app.set('view engine', 'ejs');

////Defining route for home page
app.get("/", (req, res) => {
	res.render('index');
});

app.get("/results", (req, res) => {
	const movieSearch = req.query.movieSearch;
	const apiURL = 'http://www.omdbapi.com/?apikey=thewdb&s=';
	request(apiURL + movieSearch, (error, response, body) => {
		if(!error && response.statusCode === 200){
			const movieData = JSON.parse(body);
			res.render('results', {movieData: movieData});
		}
	});
});

//The app will listen on port 3000
app.listen(PORT, () => console.log("The movie-app is listening on port 3000"));