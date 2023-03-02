
const Post = require('../models/posts');
const fs = require('fs')


module.exports = class API {
    //fetch all posts
    static async fetchAllPosts(req, res) {
        try {
            const posts = await Post.find();
            res.status(200).json(posts);
        } catch (err) {
            res.status(404).json({ message: err.message })
        }
    }

//http://localhost:5000/api/posts/?page=1&limit=2&category=Hospital
    static async fetchPostPage(req, res) {
        try {

            //3D Animation, Architecture Design, 3D Modelling
            const { page = 1, limit = 1, category = '3D Animation' } = req.query; 
            let categoryVarification = {}
            if(category != 1) {categoryVarification = {category:category}}
            const allposts = await Post.find(categoryVarification, { name: 1 })
            const posts = await Post.find(categoryVarification)
                .limit(limit * 1)
                .skip((page - 1) * limit);

            res.status(200).json({ total: allposts.length, posts });

        } catch (err) {
            console.log(err);
            res.status(404).json({
                error: err
            })
        }
    }


    static async getTotalNumbers(req, res) {
        try {
            const animation = await Post.find({category:"3D Animation"}, { heading: 1 })
            const design =  await Post.find({category:"Architecture Design"}, { heading: 1 })
            const modelling =  await Post.find({category:"3D Modelling"}, { heading: 1 })
            res.status(200).json({ animation: animation.length,design: design.length,modelling:modelling.length });

        } catch (err) {
            console.log(err);
            res.status(404).json({
                error: err
            })
        }
    }



    //fetch all posts by id
    static async fetchAllPostID(req, res) {
        const id = req.params.id;
        try {
            const post = await Post.findById(id);
            res.status(200).json(post);
        } catch (err) {
            res.status(404).json({ message: err.message })
        }
    }

    //create a posts
    static async createPost(req, res) {

        const post = req.body;
        console.log(post)
        try {
            await Post.create(post);
            res.status(201).json({ message: 'Post Created' })
        } catch (err) {
            res.status(400).json({ message: err.message })
        }


    }

    //update a posts
    static async updatePost(req, res) {
        const id = req.params.id
        const newPost = req.body;

        // console.log(newPost)
        try {
            await Post.findByIdAndUpdate(id, newPost)
            res.status(200).json({ message: 'Post Updated Sucessfully' })
        } catch (err) {
            res.status(404).json({ message: err.message })


        }

    }


    //delete a posts
    static async deletePost(req, res) {
        const id = req.params.id;
        try {
            const result = await Post.findByIdAndDelete(id)

            res.status(200).json({ message: 'Post Deleted Successfully' })
        } catch (err) {
            res.status(404).json({ message: err.message })
        }

    }


    static async createComment(req, res) {

        const id = req.params.id
        const newPost = req.body;
        console.log(id)
        console.log(newPost)
      
        try {
            await  Post.updateOne({_id:id},{$push:{comments:newPost}});
            res.status(201).json({ message: 'Comment Created' })
        } catch (err) {
            console.log(err)

            res.status(400).json({ message: err.message })
        }


    }

    
    static async deleteComment(req, res) {

        const id = req.params.id
        const oldPost = req.body;
     
        try {
            await  Post.updateOne({_id:ObjectId(id)},{$pull:{comments:oldPost}});
            res.status(201).json({ message: 'Comment Deleted' })
        } catch (err) {
            res.status(400).json({ message: err.message })
        }


    }


 
    static async getBuildingsPagination(req, res) {
        try {
            const { page, limit, category, name, location } = req.query;

            let searchInstruction = []
            if (name != '1') { searchInstruction.push({ name: name }) }
            if (category != '1') { searchInstruction.push({ type: category }) }
            if (location != '1') { searchInstruction.push({ location: location }) }

            let comencement = {}
            if (name != '1' || category != '1' || location != '1') {
                comencement['$and'] = searchInstruction
            }

            const allbuilding = await Building.find(comencement, { name: 1 })
            const building = await Building.find(comencement)
                .limit(limit * 1)
                .skip((page - 1) * limit);

            res.status(200).json({ total: allbuilding.length, building });

        } catch (err) {
            console.log(err);
            res.status(404).json({
                error: err
            })
        }
    }
    //localhost:3000/products/?page=2&limit=2
   


}


/* 
db.users.insertOne({name:"A"})


[  db.users.updateOne({"comments":'{"id1":{"name":"2","number":3}}'})  ]


//to get All items
db.users.find()

//to insert many items
db.users.insertMany([{name:'A'},{name:'B'}])


//to limit to one search
db.users.find().limit(2)


// to limit and sort "name" in an alphabetical order
db.users.find().sort({name:1}).limit(2)

// to limit and sort "name" in the reverse alphabetical order
db.users.find().sort({name:-1}).limit(2)

//to sort by "age" and sort by "name" ->[age] numerically and then [name]alphabetically
db.users.find().sort({age:1,name:1}).limit(2)


//to skip. this skips the first query
db.users.find().skip(1).limit(2)
 
QUERIES
//to find the name
db.users.find({name:"kyle"})

//to find age
db.users.find({age:26}) -> dont use "26" if its a number

//getting specific keys of an object -> name and age
db.users.find({name:"kyle"}, {name:1,age:1})

//if you dont want the id, you can specify -> _id
db.users.find({name:"kyle"}, {name:1,age:1, _id:0})

//if you dont want a key, you can specify -> age
db.users.find({name:"kyle"}, {age:0})

COMPLEX QUERIES
//find all names equal to sally
db.users.find({name:{$eq:"Sally"}})

//find all names not equal to sally
db.users.find({name:{$ne:"Sally"}})

//find all ages greater than 13
db.users.find({age:{$gt:13}})

//find all ages greater than or equal to 13
db.users.find({age:{$gte:13}})

//find all ages less than 
db.users.find({age:{$lt:13}})

//find all ages less than or equal to 13
db.users.find({age:{$lte:13}})


//find all names that are kyle and sally

db.users.find({name:{$in:["Kyle","Sally"]}})

//find all names that are not kyle and sally

db.users.find({name:{$nin:["Kyle","Sally"]}})

//check if key [age] exists -> returns objects that have age as a key
db.users.find({age:{$exists:true}})

#note -> if key is equal to null, it still exists

//check if key [age] does not exists -> returns objects that do not have age as a key
db.users.find({age:{$exists:false}})


COMBINED QUERIES

//users that have age greater than or equal to 20 and 
less than or equal to 40

db.users.find({age:{$gte:20,$lte:40}})


//users that have age greater than or equal to 20 and 
less than or equal to 40 and the name has to be sally
db.users.find({age:{$gte:20,$lte:40}, name:"Sally"})

//doing "and" queries
it gets you the ages and the names that are selected
db.users.find({$and:[{age:26},{name:"Kyle"}]})

//doing "or" queries
it gets you the ages that are less than 20 or the names that are selected
db.users.find({$or:[{age:{$lte:20}},{name:"Kyle"}]})


//get users that their age is "not" less than or equal to 20
db.users.find({age:{$not:{$lte:20}}})


COMPARING TO DATA OBJECT
{name:"Tom",balance:100,debt:200},{name:"Kristin",balance:20,debt:0}

Lets see where the debt is greater than the balance
  
db.users.find({$expr:{$gt:["$debt","$balance"]}}) -> Tom

EXTRA KNOWLEDGE
to get object properties or keys in objects

//This would get the key in the address object

#you can query further with this format based on the above examples

db.users.find({"address.street":"123 Main St"})


//find one

db.users.findOne({age:{$lte:40}})

//you can count documents

db.users.countDocuments({age:{$lte:40}}) -> 2




UPDATING DATA

//You can use $set to set new values
db.users.updateOne({_id:ObjectId("skjnskdj")},{$set:{age:27}})

and just to search, you can use this command
db.users.findOne({_id:ObjectId('skjnskdj')})


//INCREMENT
You can also use $inc to increment the user values

db.user.updateOne({_id:ObjectId('fsf')},{$inc:{age:3}})
if "age was" 3 , now it would be "6" because 3 + 3 = 6


//RENAME KEY
//You can use $rename to set new values
db.users.updateOne({_id:ObjectId("sfss")},{$rename:{name:"firstName"}})

//REMOVING A KEY or Object property
//You can use $unset to set new values
db.users.updateOne({_id:ObjectId("sjkj")},{$unset:{age:""}})


//ARRAY MANIPULATION

hobbies:["Weight Lifting","Bowling"]

//adding to array list
db.users.updateOne({_id:ObjectId("dsds")},{$push:{hobbies:"Swimming"}})

//removing from array list
db.users.updateOne({_id:ObjectId("dsds")},{$pull:{hobbies:"Swimming"}})

using queries
you can say remove everything less than or equal to the value of 3 in 
//-> My Edit
db.users.updateOne({_id:ObjectId("dsds")},{$pull:{hobbies:{$gte:3}}})

#note the queries in mongodb work anywhere in mongodb


//check if all users have an address and then delete address field -> using updateMany
db.users.updateMany({address:{$exists:true}},{$unset:{address:""}})


You can replace entire objects with this style

db.users.replaceOne({age:30},{name:"John"})


DELETE METHODS

db.users.deleteOne({name:"John"})

db.users.deleteMany({age:{$exists:false}})

*/