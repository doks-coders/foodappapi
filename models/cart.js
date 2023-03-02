const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
    procurerId:String,
    userId:String,
    procureruserId:String,
    orderId:String,
    items:Array,

    orderSent:Boolean,
    orderRecieved:Boolean,
    orderDelivered:Boolean,
    orderCancelled:Boolean,
    
    created:{
        type:Date,
        default:Date.now,
    }
})




module.exports = mongoose.model('Cart', postSchema)