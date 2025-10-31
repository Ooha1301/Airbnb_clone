if(process.env.NODE_ENV !=="production")
{
    require("dotenv").config();
};

console.log("MONGO_URL:", process.env.MONGO_URL);
const express = require("express");
const app = express();
const mongoose = require('mongoose');

// const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const {listingSchema, reviewSchema}=require("./schema.js");
// const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport=require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

main().then(()=>
{
    console.log("connected to DB");
}).catch((err)=>
{
    console.log(err);
});
async function main() {
  await mongoose.connect(dbUrl);
}


app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"public")));


const store = MongoStore.create
(
    {
        mongoUrl:dbUrl,
        crypto:
        {
            secret: process.env.SECRET,
        },
        touchAfter:24*3600,
    }
);

store.on("error",()=>
{
    console.log("Error in mongo session store",err);
});

const sessionOptions={
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:
    {
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};


// app.get("/",(req,res)=>
//     {
//         res.send("HI , i am root");
//     });
    

app.use(session(sessionOptions));
app.use(flash());
//should always use flash after session and before using router

//passport middleware
//passport even needs sessions so use of passport should be after session
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware for flash
app.use((req,res,next)=>
{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser=req.user;
    // console.log(res.locals.success);
    next();
});

// //demo fake user
// app.get("/demouser",async(req,res)=>
// {
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"delta-student",
//     });
//     let registeredUser=await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// });

// //to use the listing.js and review.js using router
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


app.all("*",(req,res,next)=>
{
    next(new ExpressError(404,"Page not found"));
});

app.use((err, req, res, next)=>
{
    let {statusCode=500,message="something went wrong"}=err;
    res.render("listings/error.ejs",{err});
    //res.status(statusCode).send(message);
});
// ---------------------- error handling ----------------------
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).render("listings/error.ejs", { err });
});

// ---------------------- deployment handling ----------------------

// ✅ In local development → run the server
// ✅ In production (Vercel) → export the app instead
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
} else {
    module.exports = app;
}



// app.get("/testListing",async(req,res)=>
    // {
    //     let sampleListing = new Listing({
    //         title:"My New Villa",
    //         description:"By the beach",
    //         price:1200,
    //         location:"Goa",
    //         country:"India",
    //     });
    //     await sampleListing.save();
    //     console.log("sample is saved");
    //     res.send("successful testing");
    // });
