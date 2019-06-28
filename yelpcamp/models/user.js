const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


const userSchema = new mongoose.Schema({
	username: {type: String, unique: true, required: true},
	password: String,
	email: {type: String, unique: true, required: true},
	avatar: String,
	firstName: String,
	lastName: String,
	isAdmin: {type: Boolean, default: false},
	resetPasswordToken: String,
	resetPasswordExpires: Date
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);