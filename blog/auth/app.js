const express = require('express');
const app = express();
const PORT = 3000;
const LOCALHOST = 127001;
const mongoose = require('mongoose');


//Settings of the app
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/secret', {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);

//ROUTES ==============================================================================

//Home page route
app.get("/", (req, res) =>{
	res.render("home");
});

//Secret route
app.get("/secret", (req, res) =>{
	res.render("secret");
});


//Start the server=======================================================================

app.listen(PORT || process.env.PORT, process.env.IP || LOCALHOST, () => {
	console.log("The server is listening on port 3000 with localhost 127.0.0.1");
});