const mongoose = require('mongoose');
const plm=require("passport-local-mongoose")
mongoose.connect("mongodb://localhost:27017/newapp")

// Define user schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },

    password: { type: String },
    post: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    dp: { type: String },
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
});




userSchema.plugin(plm);   //passport

// Define and export User model
module.exports = mongoose.model('User', userSchema);

