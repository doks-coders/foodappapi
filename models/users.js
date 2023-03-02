const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
    name:String,
    email:String,
    firebaseId:String,
    coverimage:String,
    image:String,
    favouriteItems:Object,
    cartItems1:Array,
    cartItems:Array,
    notifications:Array,
    orderInformation:Array,
    coordinates:Array,
    location:Object,
    cartKeys:Array,
    chatRooms:Array,
    otp:String,
    paymentmethod:Array,

    created:{
        type:Date,
        default:Date.now,
    }
})


module.exports = mongoose.model('Users', postSchema)


/**
 * \
name:String,
email:String,
coverimage:String,
image:String,
favouriteItems:Object,
cartItems1:Array,
cartItems:Array,
notifications:Array,
orderInformation:Array,
coordinates:Array,
location:Array,
cartKeys:Array,
chatRooms:Array,
 */