const Doctor = require('../models/doctors');
const Building = require('../models/buildings');
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

        const posts = req.body;
        const imagename = req.file.filename;
        posts.image = imagename;
        try {
            await Post.create(posts);
            res.status(201).json({ message: 'Post Created' })
        } catch (err) {
            res.status(400).json({ message: err.message })
        }

    }

    //update a posts
    static async updatePost(req, res) {
        const id = req.params.id;
        let new_image = ''
        if (req.file) {
            new_image = req.file.filename
            try {
                fs.unlinkSync('.././client/public/' + req.body.old_image)
                // fs.unlinkSync('./uploads/' + req.body.old_image);
            } catch (err) {
                console.log(err)
            }
        } else {
            new_image = req.body.old_image
        }
        const newPost = req.body;
        newPost.image = new_image
        try {
            await Post.findByIdAndUpdate(id, newPost)
            res.status(200).json({ message: 'Post Updated Sucessfully' })
        }catch (err) {
            res.status(404).json({ message: err.message })


        }

    }


    //delete a posts
    static async deletePost(req, res) {
        const id = req.params.id;
        try {
            const result = await Post.findByIdAndDelete(id)
            if (result.image != '') {
                try {
                    fs.unlinkSync('.././client/public/' + result.image)
                    // fs.unlinkSync('./uploads/' + result.image)
                } catch (err) {
                    console.log(err);
                }
            }
            res.status(200).json({ message: 'Post Deleted Successfully' })
        } catch (err) {
            res.status(404).json({ message: err.message })
        }

    }

    //localhost:3000/products/?page=2&limit=2
    static async getPagination(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const products = await Post.find()
                .limit(limit * 1)
                .skip((page - 1) * limit);

            res.status(200).json({ total: products.length, products });

        } catch (err) {
            console.log(err);
            res.status(404).json({
                error: err
            })
        }
    }
static async showDoctorsMessage(req,res){
    res.status(200).json({message:'Please'})
}


//http://localhost:5000/api/doctors/doctor/?page=1&limit=2
    static async getDoctorPagination(req, res) {
        try {
            const { page = 1, limit = 3 } = req.query;

            const alldoctors = await Doctor.find({},{name:1})
            const doctors = await Doctor.find()
                .limit(limit * 1)
                .skip((page - 1) * limit);

            res.status(200).json({ total: alldoctors.length, doctors });

        } catch (err) {
            console.log(err);
            res.status(404).json({
                error: err
            })
        }
    }


    static async fetchAllDoctorID(req, res) {
        const id = req.params.id;
        try {
            const doctor = await Doctor.findById(id);
            res.status(200).json(doctor);
        } catch (err) {
            res.status(404).json({ message: err.message })
        }
    }

    static async createDoctor(req, res) {


        let {subspeciality,affiliates,accomplishments,experience,education} = req.body
        const doctor = req.body;


       
        const imagename = req.file.filename;
        console.log(imagename)
        doctor.image = imagename;
        doctor.subspeciality = JSON.parse(subspeciality)
        doctor.affiliates = JSON.parse(affiliates)
        doctor.accomplishments = JSON.parse(accomplishments)
        doctor.experience = JSON.parse(experience)
        doctor.education = JSON.parse(education)
       
        try {
            await Doctor.create(doctor);
            res.status(201).json({ message: 'Doctor Uploaded' })
        } catch (err) {
            res.status(400).json({ message: err.message })
        }

    }

    static async updateDoctorInformation(req, res) {
        const id = req.params.id;
        let new_image = ''
        if (req.file) {
            new_image = req.file.filename
            try {
                fs.unlinkSync('.././client/public/' + req.body.old_image)
                // fs.unlinkSync('./uploads/' + req.body.old_image);
            } catch (err) {
                console.log(err)
            }
        } else {
            new_image = req.body.old_image
        }
        const newDoctor = req.body;
        newDoctor.image = new_image
        try {
            await Doctor.findByIdAndUpdate(id, newDoctor)
            res.status(200).json({ message: 'Person Updated Sucessfully' })
        } catch (err) {
            res.status(404).json({ message: err.message })


        }

    }

    static async deleteDoctorInformation(req, res) {
        const id = req.params.id;
        try {
            const result = await Doctor.findByIdAndDelete(id)
            if (result.image != '') {
                try {
                    fs.unlinkSync('.././client/public/' + result.image)
                    // fs.unlinkSync('./uploads/' + result.image)
                } catch (err) {
                    console.log(err);
                }
            }
            res.status(200).json({ message: 'Post Deleted Successfully' })
        } catch (err) {
            res.status(404).json({ message: err.message })
        }

    }

    ////<!----------------!>/////

    //http://localhost:5000/api/buildings/building/?page=1&limit=2&category=Hospital

    static async getBuildingsPagination(req, res) {
        try {
            const { page = 1, limit = 3, category = 'Hospital' } = req.query;

            const allbuilding = await Building.find({type: category},{name:1})
            const building = await Building.find({ type: category })
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
    static async getAllBuildingsName(req, res) {
        try {
            const allbuilding = await Building.find({},{name:1})
            res.status(200).json({ total: allbuilding.length, allbuilding });

        } catch (err) {
            console.log(err);
            res.status(404).json({
                error: err
            })
        }
    }


    static async fetchAllBuildingID(req, res) {
        const id = req.params.id;
        try {
            const building = await Building.findById(id);
            res.status(200).json(building);
        } catch (err) {
            res.status(404).json({ message: err.message })
        }
    }

    static async getAffiliatesId(req, res) {
        const id = req.params.id;
        try {
            const building = await Building.find({_id: id},{name:1,image:1})
            res.status(200).json(building);
        } catch (err) {
            res.status(404).json({ message: err.message })
        }
    }


    static async createBuilding(req, res) {

        const building = req.body;
        const imagename = req.file.filename;
        building.image = imagename;
        try {
            await Building.create(building);
            res.status(201).json({ message: 'Building Uploaded' })
        } catch (err) {
            res.status(400).json({ message: err.message })
        }

    }

    static async updateBuildingInformation(req, res) {
        const id = req.params.id;
        let new_image = ''
        if (req.file) {
            new_image = req.file.filename
            try {
                fs.unlinkSync('.././client/public/' + req.body.old_image)
                // fs.unlinkSync('./uploads/' + req.body.old_image);
            } catch (err) {
                console.log(err)
            }
        } else {
            new_image = req.body.old_image
        }
        const newBuilding = req.body;
        newBuilding.image = new_image
        try {
            await Building.findByIdAndUpdate(id, newBuilding)
            res.status(200).json({ message: 'Building Updated Sucessfully' })
        } catch (err) {
            res.status(404).json({ message: err.message })


        }

    }


    static async deleteBuildingInformation(req, res) {
        const id = req.params.id;
        try {
            const result = await Building.findByIdAndDelete(id)
            if (result.image != '') {
                try {
                    fs.unlinkSync('.././client/public/' + result.image)
                    // fs.unlinkSync('./uploads/' + result.image)
                } catch (err) {
                    console.log(err);
                }
            }
            res.status(200).json({ message: 'Post Deleted Successfully' })
        } catch (err) {
            res.status(404).json({ message: err.message })
        }

    }


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