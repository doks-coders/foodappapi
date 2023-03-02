const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
  
    created:{
        type:Date,
        default:Date.now,
    }
})


module.exports = mongoose.model('Recipes', postSchema)