const express = require('express')
const router = express.Router();
const API = require('../controllers/api');
const multer = require('multer');
let storage = multer.diskStorage({
    destination:function(req,file,cb){
     cb(null, '.././client/public');  
    // cb(null, './uploads');   
    },
    filename:function(req, file, cb){
        cb(null, file.fieldname+"_"+Date.now()+"_"+file.originalname);
    }
})

let upload = multer({
    storage:storage,
}).single("image");

router.get("/allitems/",API.fetchAllItems)

router.get("/chosenrecipes",API.fetchChosenItem)
router.get("/chosenequipments",API.fetchChosenItem)
router.get("/chosenproducts",API.fetchChosenItem)
router.get("/chosenprocurers",API.fetchChosenItem)

router.get("/chosenrecipes/:id",API.fetchChosenItemId)
router.get("/chosenproducts/:id",API.fetchChosenItemId)
router.get("/chosenequipments/:id",API.fetchChosenItemId)
router.get("/chosenprocurers/:id",API.fetchChosenItemId)
router.get("/selecteduser/:id",API.getSelectedUser)

router.get("/choseningredients",API.fetchProductItem)
router.get("/chosenutensils",API.fetchProductItem)


router.post("/create-user",upload,API.createUser)
router.post("/email-otp/:id",upload,API.emailOTPProcess)
router.post("/verify-otp",upload,API.verifyOTP)
router.post("/register-user-details",upload,API.registerUserMethod)
router.get("/fireid/:id",API.getUserWithFirebaseid)




router.post("/add-cartitem/",upload,API.addToCartItem)

router.post("/get-cartheaders/",upload,API.getCartHeaders)

router.get('/selected-cart-items',API.getSelectedCartItems)

router.post("/get-cartitem/",upload,API.getCartItems)

router.post("/edit-cartitem/",upload,API.editCartItems)


router.post("/set-cart-order-active/:id",upload,API.setCArtOrderToActive)
router.get("/set-cart-order-recieved",API.setCartOrderRecieved)


router.get("/create-message",API.createMessage)

router.post("/get-all-chatrooms",upload,API.getAllChatrooms)

router.post("/send-comment",upload,API.sendComment)
router.post("/modify-favourites/",upload,API.modifyFavourites)












//Get All User in Pagination




module.exports = router