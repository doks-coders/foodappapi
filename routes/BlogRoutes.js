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

router.get("/allposts/",API.fetchAllPosts)


//Get All User in Pagination
router.get("/posts/",API.fetchPostPage)

//Get User Information
router.get("/posts/:id",API.fetchAllPostID)



router.post("/posts/",upload,API.createPost)
router.patch("/posts/:id",upload,API.updatePost)

router.delete("/posts/:id",API.deletePost)


router.post("/comments/:id",upload,API.createComment)

router.get("/total/",API.getTotalNumbers)



module.exports = router