require('dotenv').config();
const express= require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(express.static("uploads"));

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:true,
    useCreateIndex:true,
    dbName:"foodapp"
}).then(()=>{
    console.log('Connected')

}).catch(err=>console.log(err));
 
/*
var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb://user:wordpass@ac-och78gr-shard-00-00.gd5qksr.mongodb.net:27017,ac-och78gr-shard-00-01.gd5qksr.mongodb.net:27017,ac-och78gr-shard-00-02.gd5qksr.mongodb.net:27017/?ssl=true&replicaSet=atlas-fr8omb-shard-0&authSource=admin&retryWrites=true&w=majority";
MongoClient.connect(uri,  async(err, client)=> {
  const collection = await client.db("foodapp").collection("products").find().toArray();
  // perform actions on the collection object
  console.log({collection})
             
  client.close();
});
*/




app.use('/api/', require("./routes/FoodRoutes"));

if(process.env.NODE_ENV ==='production'){
    app.use(express.static(__dirname+'/dist/'));
    app.get('*',(req,res)=>{
        res.sendFile(__dirname+"/dist/index.html")
    })
}
app.listen(port, ()=> console.log(`server is at ${port}`))