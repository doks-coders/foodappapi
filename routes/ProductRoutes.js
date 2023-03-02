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



//
//Get All Doctors in Pagination

router.get("/product/",API.getDoctorPagination)

//Get Doctor Information
router.get("/product/:id",API.fetchAllDoctorID)

router.post("/product/",upload,API.createDoctor)
router.patch("/product/:id",upload,API.updateDoctorInformation)
router.delete("/product/:id",API.deleteDoctorInformation)






module.exports = router