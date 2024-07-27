const {listingSchema, reviewSchema}=require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const listingController = require("./controllers/listings.js");


module.exports.isLoggedIn=(req,res,next)=>
{
    if(!req.isAuthenticated())
        {
            req.session.redirectUrl=req.originalUrl;
            req.flash("error","You must be logged in to create new listing");
            return res.redirect("/login");
        }
        next();
};


//when logged in we are redirecting it to respective wanted page by this middleware
module.exports.saveRedirectUrl=(req,res,next)=>
{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

//to check wether user is owner or not
module.exports.isOwner=async(req,res,next)=>
{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id))
        {
            req.flash("error","You are not the owner of this listing");
            return res.redirect(`/listings/${id}`);
        }
    next();
};

//validation middle ware
module.exports.validateListing=(req,res,next)=>
    {
        let {error} = listingSchema.validate(req.body);
       //console.log(error);
        if(error)
        {
            let errorMsg = error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400,errorMsg);
        }
        else{
            next();
        }
    };


    //to validate review
module.exports.validateReview=(req,res,next)=>
    {
        let {error} = reviewSchema.validate(req.body);
        // console.log(result);
        if(error)
        {
            let errorMsg = error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400,errorMsg);
        }
        else{
            next();
        }
    };


    //to check wether user is owner or not
module.exports.isReviewAuthor=async(req,res,next)=>
    {
        let {id, reviewId}=req.params;
        let review=await Review.findById(reviewId);
        if(!review.author.equals(res.locals.currUser._id))
            {
                req.flash("error","You are not the author of this review");
                return res.redirect(`/listings/${id}`);
            }
        next();
    };