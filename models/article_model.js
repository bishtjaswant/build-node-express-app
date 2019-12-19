
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    "title" :  { type: String, required: true },
    "author" : { type: String, required: true },
    "desc" :  { type: String, required: true }
});
const article  = mongoose.model('article', articleSchema);

module.exports=article;