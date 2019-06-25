const mongoose = require('mongoose');

//db comment schema set up
const commentSchema = mongoose.Schema({
	text: String,
	createdAt: {type: Date, default: Date.now},
	author: {
		id: {type: mongoose.Schema.Types.ObjectId,
			ref: "User"},
		username: String,
		email: String
	}
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;