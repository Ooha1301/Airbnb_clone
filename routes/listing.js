const express=require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
//const {listingSchema, reviewSchema}=require("../schema.js");
// const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js")
const multer = require("multer");

const {storage}=require("../cloudConfig.js");

const upload = multer({storage});

const listingController = require("../controllers/listings.js");

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),wrapAsync(listingController.createListing));
// .post(upload.single('listing[image]'),(req,res)=>validateListing
// {
//     res.send(req.file);
// })
router.route("/:id")
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))//,validateListing
.get(wrapAsync(listingController.showListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

//NEW ROUTE
router.get("/new",isLoggedIn,listingController.renderNewForm)


//EDIT ROUTE
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));
    
//INDEX ROUTE
// router.get("/",wrapAsync(listingController.index));
    

//SHOW ROUTE
// router.get("/:id",wrapAsync(listingController.showListing));
    
//CREATE ROUTE
// router.post("/",validateListing,wrapAsync(listingController.createListing));
    

//UPDATE ROUTE
// router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing));
    
//DELETE ROUTE
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


module.exports=router;