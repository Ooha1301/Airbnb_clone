const express=require("express");
const router = express.Router({mergeParams:true});
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

router.route("/signup")
.get((req,res)=>
    {
        res.render("users/signup.ejs");
    })
.post(wrapAsync(userController.signup));


router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
(userController.login));

router.get("/logout",userController.logout);

//get req to render form page
// router.get("/signup",(req,res)=>
//     {
//         res.render("users/signup.ejs");
//     });


//post req to add new user
// router.post("/signup",wrapAsync(userController.signup));

// router.get("/login",userController.renderLoginForm);

//when logged in we are redirecting it to respective wanted page by this
// router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),(userController.login));




module.exports=router;