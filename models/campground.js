const mongoose = require('mongoose');

//db camground schema setup
const campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	urlCamping: String,
	price: String,
	location: String,
	lat: Number,
	lng: Number,
	createdAt: {type: Date, default: Date.now},
	author: {
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String,
		email: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

const Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;