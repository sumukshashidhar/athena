var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    userType: String, 
    securityQuestion: String,
    securityAnswer: String, 
    LastSeen: Date,
    AuthCode: String,
    lastUpdatedOn: Date,
    user_Activity: Number,
    Verified: false,
    profilePic: String,
    Interests: String,
    iv: String
});

module.exports = mongoose.model("User", UserSchema);