const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/newapp")
// Define post schema
const postSchema = new mongoose.Schema({
    imageText: { type: String, required: true },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    image:{
        type:String
    },

    createdAt: { type: Date, default: Date.now },
    likes: { type: Array, 
        default: [] },     
});

// Define and export Post model
module.exports = mongoose.model('Post', postSchema);
