const Users = require('../models/users');
const Cart = require('../models/cart');
const Recipes = require('../models/recipes');
const Procurers = require('../models/procurers')
const Chatrooms = require('../models/chatrooms')

const Products = require('../models/products');
const Equipments = require('../models/equipments');
const Finishedorders = require('../models/finishedorders')
const client = require('@sendgrid/client')
const fetch = require('node-fetch')
const request = require('request')


const { configureProcurement, uid1, getSelectedChatRooms,sendEmail, uidNumber,getArrayFromOneWord } = require('../misc/index');

const mongoose = require('mongoose');
const fs = require('fs')

const getItems = (value) => {
    let objectOfValues = {
        'recipes': Recipes,
        'procurers': Procurers,
        'products': Products,
        'equipments': Equipments,
    }

    return objectOfValues[value]
}


const { db } = mongoose.connection;



module.exports = class API {


  static async deleteSendGridKey(req,res){

client.setApiKey(process.env.SENDGRIDKEY)

const api_key_id = '2Ut-YCzpTUypCALuGwVtvA'; 
const headers = { 
        "on-behalf-of": "The subuser's username. This header generates the API call as if the subuser account was making the call." ,
        Authorization: `Bearer ${api_key_id}`
            }; 
/*const request = { 
    url: `/v3/api_keys/${api_key_id}`, 
method: 'DELETE', 
headers: headers 
}
*/


var options = { method: 'DELETE', 
url: `https://api.sendgrid.com/v3/api_keys/${api_key_id}`, 
headers: { Authorization: `Bearer ${process.env.SENDGRIDKEY}`, 
'on-behalf-of': "The subuser's username. This header generates the API call" } 
}; 
request(options, function (error, response) 
{ if (error) throw new Error(error); 
    console.log(response.body); 
    res.status(201).json({response})
});
/*

let result = await fetch(`https://api.sendgrid.com/v3/api_keys/${api_key_id}`,
{
  method: "DELETE",
  headers: { 
    "on-behalf-of": "The subuser's username. This header generates the API call as if the subuser account was making the call." ,
    "Authorization": `Bearer ${api_key_id}`
}
})
.then((response) => response.json())
.then((responseData) => {
    res.status(201).json({responseData}) ;
})
.catch(error => {console.warn(error);
    res.status(404).json({error}) 
});
return result
*/

/*
client.request(request).then(([response,body])=>{

}) .catch(error => {
        console.warn(error)
        res.status(404).json({error}) ;
    });
    */

}



  
    static async fetchAllItems(req, res) {
        try {

        
            const recipes = await Recipes.find()
            const procurers = await Procurers.find({},{cartKeys:0,chatrooms:0,testimonials:0,notifications:0})
            const products = await Products.find()
            const equipments = await Equipments.find()

            res.status(200).json({recipes, procurers, products, equipments });
        } catch (err) {
            res.status(404).json({ message: err.message })
        }
    }

    static async fetchUsers(req, res) {
        try {
            const users = await Users.find();
            res.status(200).json({ users });
        } catch (err) {
            res.status(404).json({ message: err.message })
        }
    }

    static async fetchChosenItem(req, res) {

        try {
            const id = req.route.path
            const strVal = id.replace('/chosen', '')
            const chosenItems = await getItems(strVal).find();

            res.status(200).json({ chosenItems });
        } catch (err) {
            res.status(404).json({ message: err.message })
        }
    }


    static async fetchChosenItemId(req, res) {
        const path = req.route.path
        const strVal = path.replace('/:id', '').replace('/chosen', '')
        const id = req.params.id;


        try {
            const chosenItems = await getItems(strVal).findById(id);
            res.status(200).json(chosenItems);

        } catch (err) {
            res.status(404).json({ message: err.message })
        }
    }

    static async getProductID(req, res) {
  

 
        try {
     
            const {id,type} = req.body
           
            const procurer = await Procurers.find({},{ingredients:1,utensils:1,name:1})
    
            let allIngredients = procurer.map((val) => {
    
                const addedProcurerNames = val['_doc'].ingredients.map(itemVal => {
                    return { ...itemVal, procurerName: val['_doc'].name }
                })
        
                return addedProcurerNames
            })
            let allUtensils = procurer.map((val) => {
        
                const addedProcurerNames = val['_doc'].utensils.map(itemVal => {
                    return { ...itemVal, procurerName: val['_doc'].name }
                })
                return addedProcurerNames
            })
        
            let result = [...allIngredients, ...allUtensils]
            let allItems = ([].concat(...result))

              const productItem = allItems.filter((val)=>val.id==id)[0]
             
              console.log({productItem})
                res.status(200).json(productItem);

        } catch (err) {
            res.status(404).json({ message: err.message })
        }
        
    }

    


    static async fetchProductItem(req, res) {
        const id = req.route.path
        const strVal = id.replace('/chosen', '')

        try {
            let procurerArray = await Procurers.find()
            let result = await configureProcurement({ array: procurerArray, target: strVal })
            res.status(200).json(result);
        } catch (error) {
            res.status(404).json({ message: error.message })
        }


    }

    static async addToCart(req, res) {
        const cartItem = req.body;

        try {
            let result = await Users.updateOne({ _id: ObjectId("dsds") }, { $push: { cart: cartItem } })
            res.status(200).json(result);
        } catch (error) {
            res.status(404).json({ message: error.message })
        }


    }



    static async createUser(req, res) {
        const { firebaseId,name,email,favouriteItems } = req.body
        const userbody = { firebaseId,name,email,favouriteItems }
        console.log({userbody})
        try {

            const newUser = await Users.create(userbody)
            res.status(201).json(newUser)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    static async getIngredientsProcurerInfo(req, res) {
    const {name,arrayKey,targetKey,type} = req.body
    
    //{name:ingredientProcurementDetails.name,baseArray:allProcurers,arrayKey:'ingredients',targetKey:'name'}
    try {
        if(type=='procurers'){
            const allProcurers = await Procurers.find({},{ingredients:1,utensils:1,location:1,image:1,text:1,name:1})
            let result = getArrayFromOneWord({name,baseArray:allProcurers,arrayKey,targetKey})
            res.status(201).json(result)
        }
        
        if(type=='recipes'){
            const allRecipes = await Recipes.find({},{ingredients:1,utensils:1,image:1,name:1})
            let result = getArrayFromOneWord({name,baseArray:allRecipes,arrayKey,targetKey})
            res.status(201).json(result)
        }
       
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }



    
    static async getUserWithFirebaseid(req,res){
       const fireid = req.params.id
        try {
       let users = await Users.find({firebaseId:fireid})
       console.log({users})
            res.status(201).json(users[0])
        } catch (error) {
            res.status(404).json({message:error.message})
        }
    }
    static async emailOTPProcess(req,res){
        console.log('Email Commenced')
        const userId =  req.params.id
        console.log({userId})
        const code = uidNumber()
        try {
              await Users.updateOne({_id:userId},{$set:{otp:code}})
            const user  = await Users.find({_id:userId})
            const email = user[0]['_doc'].email
            const name = user[0]['_doc'].name
            console.log({email})
            const msg = {
                from: 'guonnie@gmail.com',
                to: email,
                subject: 'Verification Code For App',
                text: `${name}, please use this verification code ${code} to create your account`,
              //  html: '<></>',
            }
            console.log({msg})
            sendEmail({ msg }).then(() => {
    
                res.status(200).json({ message: 'Message Sent Successfully' })
            }).catch(err => {
                res.status(404).json({ message: err.message })
            })

            
        } catch (error) {
            
        }
       

    }

    static async verifyOTP(req, res) {
        const {userId,otpNumber} = req.body
        
        try {
            const user = await Users.find({_id:userId})
            const userOtp = user[0]['_doc'].otp
            if(userOtp){
                if(otpNumber==userOtp){
                    res.status(201).json({message:'It matches'})
                }else{
                    res.status(201).json({message:`It doesn't match`})
                }
            }else{
                res.status(404).json({message:'No OTP'})
            }

        } catch (error) {
            res.status(404).json({message:error.message})
        }
    }

    
static async registerUserMethod(req,res){
    const {value,key,userId} = req.body

    try {
        let setObject = {}
        setObject[key] = value 
        let result = await Users.updateOne({_id:userId},{$set:setObject})
    res.status(201).json({message:'Success'})
    } catch (error) {
        res.status(404).json({message:error.message})
    }

}
    static async addToCartItem(req, res) {
        const cartItem = req.body;
        let copiedItems = { ...cartItem }
        let { procurerId, userId } = copiedItems
        copiedItems['procureruserId'] = procurerId + userId
        let id
        try {
            let check = await Cart.find({ procureruserId: (procurerId + userId) })


            if (!check.length) {
                let result = await Cart.create(copiedItems)
                id = result._id
                await Procurers.updateOne({ _id: result.procurerId }, { $push: { cartKeys: id } })
                await Users.updateOne({ _id: result.userId }, { $push: { cartKeys: id } })

                res.status(200).json('New Cart Entry');

            } else {
                let items = check[0]['_doc'].items
                let incomingItems = copiedItems.items
                let newItems = [...items, ...incomingItems]
                await Cart.updateOne({ procureruserId: (procurerId + userId) }, { $set: { items: newItems } })


            }







            res.status(200).json('Cart Entry Still Active');
            /**
             * We are trying to check if there is a cart available already that has not been sent to the user
             * So where are we checking 
             * we check if the id of the user and the id of the procurer are the same
             * so we will check if the username of the procurerid+userid exist
             * if it exists then we simply add our cartitems to the old items
             * 
             */
            //We Create the Cart item

            //We add the orderId to the vendor and the user






        } catch (error) {
            res.status(404).json({ message: error.message })
        }


    }




    static async getCartItems(req, res) {
        const array = req.body

        try {
            const result = await Cart.find({ _id: { $in: array } })

            let filteredEl = result.filter((val) => {
                if (!val.orderRecieved) {
                    return val
                }
                if (val.orderRecieved != true) {
                    return val
                }

            })
            let newEl = []
            filteredEl.forEach(async (val) => {
                let procurer = await Procurers.find({ _id: val.procurerId })
                const { name, image, _id } = procurer[0]['_doc']
                newEl.push({ procurerId: _id, procurerName: name, procurerImage: image, ...val['_doc'] })
            })



            let tid = setInterval(() => {
                if (newEl.length == filteredEl.length) {
                    res.status(201).json(newEl)
                    clearInterval(tid)
                }
            }, 50)

        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    static async editCartItems(req, res) {
        const { chosenCartId, indexOfElement, method, value } = req.body
        try {

            if (method == 'delete') {
                const result = await Cart.find({ _id: chosenCartId })
                let items = result[0].items

                items.splice(indexOfElement, 1)

                await Cart.updateOne({ _id: chosenCartId }, { $set: { items } })

                res.status(200).json({ message: 'Deleted Successfully' })

            }

            if (method == 'edit') {
                console.log('Edit true')
                const result = await Cart.find({ _id: chosenCartId })

                let items = result[0].items

                items[indexOfElement].amount = value
                await Cart.updateOne({ _id: chosenCartId }, { $set: { items } })

                res.status(200).json({ message: 'Edited Successfully' })

            }

            res.status(200).json(result)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }






    static async getCartHeaders(req, res) {
        const array = req.body

        try {
            const cartElements = await Cart.find({ _id: { $in: array } })
            let filteredEl = cartElements.filter((val) => {
                if (!val.orderRecieved) {
                    return val
                }
                if (val.orderRecieved != true) {
                    return val
                }

            })

            console.log({ filteredEl })

            const procurerList = filteredEl.map((val) => val.procurerId)

            const procurerElements = await Procurers.find({ _id: { $in: procurerList } })
            //

            res.status(200).json(procurerElements)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    static async getSelectedCartItems(req, res) {


        const { userid, procurerid } = req.query;
        console.log({ userid, procurerid })

        try {
            let result = await Cart.find({ procureruserId: (procurerid + userid) })

            console.log({ result })
            res.status(200).json(result)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }





    static async getSelectedUser(req, res) {
        const id = req.params.id;
        try {
            const chosenUser = await Users.findById(id);
            res.status(200).json(chosenUser);

        } catch (err) {
            res.status(404).json({ message: err.message })
        }
    }

    static async setCArtOrderToActive(req, res) {

        const cartid  = req.params.id;
        const object = req.body
        console.log({object})
        try {
            const cartSetup = await Cart.updateOne({ _id: cartid }, { $set: { orderSent: true,...object } })
            console.log(cartid)

            res.status(200).json({ message: cartSetup });

        } catch (err) {
            res.status(404).json({ message: err.message })
        }
    }

    static async setCartOrderRecieved(req, res) {

        const { cartid } = req.query;
        try {
            const cartSetup = await Cart.updateOne({ _id: cartid }, { $set: { orderRecieved: true } })

            const cartDetails = await Cart.find({ _id: cartid })

            console.log({ cartDetails: cartDetails[0]['_doc'] })

            const finishedCart = await Finishedorders.create(cartDetails[0]['_doc'])
            const deleteCart = await Cart.findByIdAndDelete(cartid)
            console.log({ deleteCart })


            /*  await Users.updateOne({_id:cartDetails[0]['_doc'].userId},{$pull:{cartKeys:cartid}})
            await Procurers.updateOne({_id:cartDetails[0]['_doc'].procurerId},{$pull:{cartKeys:cartid}})
            console.log({cartDetails:cartDetails['_doc']})
*/


            res.status(200).json({ message: cartSetup });

        } catch (err) {
            res.status(404).json({ message: err.message })
        }
    }



    static async createMessage(req, res) {
        const { userId, procurerId } = req.query
        const id = uid1()
        const newMessage = {
            userId,
            procurerId,
            userIdandProcurerid: userId + procurerId,
            roomId: id,
            messages: [],
        }

        try {
            const checkIfMessageExists = await Chatrooms.find({ userIdandProcurerid: userId + procurerId })

            if (checkIfMessageExists.length == 0) {
                const _res = await Chatrooms.create(newMessage)

                const _result = await Users.updateOne({ _id: userId }, { $push: { chatRooms: _res._id } })
                const _result1 = await Procurers.updateOne({ _id: procurerId }, { $push: { chatRooms: _res._id } })

                res.status(201).json({ message: 'Successfully Created', messageId: _res._id });
            } else {
                res.status(201).json({ message: 'Created Before', messageId: checkIfMessageExists[0]['_doc']._id })
            }


        } catch (err) {
            res.status(404).json({ message: err.message })
        }
    }


    static async getAllChatrooms(req, res) {
        const chatRoomarray = req.body
        getSelectedChatRooms(chatRoomarray).then(val => {
            res.status(201).json(val)
        }).catch(err => {
            res.status(404).json({ message: err.message })
        })
    }

    static async sendComment(req, res) {
        const { procurerId, commentBody } = req.body
        const { rating, comment, date, name, userId } = commentBody
        try {
            let user = await Users.find({ _id: userId })
            commentBody.name = user[0]['_doc'].name
            commentBody.date = Date.now()
            console.log({ commentBody })
            await Procurers.updateOne({ _id: procurerId }, { $push: { testimonials: commentBody } })
            res.status(201).json({ message: 'Success' })
        } catch (error) {
            res.status(404).json({ message: error.message })
        }

    }



    static async modifyFavourites(req, res) {
        const { userId, id, type, mode } = req.body

        try {

            if (mode == 'add') {
                let user = await Users.find({ _id: userId })
                let userObject = user[0]['_doc']
                //Add Process
                userObject.favouriteItems[type].push(id)

                console.log(userObject.favouriteItems[type])
                console.log({ id })

                let edituser = await Users.updateOne({ _id: userId }, { $set: { favouriteItems: userObject.favouriteItems } })
                console.log('Successfully Added')

                res.status(201).json({ message: 'Success' })
            }

            if (mode == 'remove') {
                let user = await Users.find({ _id: userId })
                let userObject = user[0]['_doc']
                //Delete Process
                let arrayOfFavouriteType = userObject.favouriteItems[type]
                let indexOfId = arrayOfFavouriteType.findIndex((val) => val == id)
                console.log({ indexOfId })
                arrayOfFavouriteType.splice(indexOfId, 1)
                console.log({ deletedObject: arrayOfFavouriteType })

                userObject.favouriteItems[type] = arrayOfFavouriteType
                console.log('Successfully Deleted')

                console.log(userObject.favouriteItems[type])


                let edituser = await Users.updateOne({ _id: userId }, { $set: { favouriteItems: userObject.favouriteItems } })
                res.status(201).json({ message: 'Success' })
            }


        } catch (error) {
            res.status(404).json({ message: error.message })
        }

    }




    //


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