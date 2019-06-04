const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://MariseStp:MyDBOnTheCloud2019!@cluster0-ncteq.mongodb.net/test?retryWrites=true', {
	useNewUrlParser: true, 
	useCreateIndex: true
}).then(() => {
		console.log('connected to DB!');
}).catch(err =>{
	console.log('Error!', err.message);
});

const PostSchema = new mongoose.Schema({
	title: String,
	description: String,
});

const Post = mongoose.model("Post", PostSchema);


app.get('/', async (req, res) => {
	let post = await Post.create({title: 'test', description: 'This is a test also'});
	res.send(post);
});

app.listen(3000, () => {
	console.log('server listening on port 3000');
});

