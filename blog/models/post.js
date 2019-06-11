const mongoose = require('mongoose');

//POST - Title, image, body and date
const postSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;