var express = require("express"),
    bodyParser = require("body-parser"),
    app = express(),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    flash           = require("connect-flash");

// Requiring routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds")
    indexRoutes = require("./routes/index")


app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended : true}))
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"))
app.use(flash());


// Passport stuff
var User = require("./models/user")

app.use(require("express-session")({
    secret : "This is the encosing string",
    resave : false,
    saveUninitialized : false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){ // used to push current user details to all routes
    res.locals.currUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

// Database connection
mongoose.connect("mongodb://localhost:27017/yelp_camp_10", { useNewUrlParser: true,  useUnifiedTopology: true}) 

var Campground  = require("./models/campground.js"),
    seedDB      = require("./seed.js"), 
    Comment     = require("./models/comment.js")

// seedDB();

// using the routes
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

const port = process.env.PORT || 3000;
app.listen(port, function(req, res){
    console.log("Yelpcamp v1 started...");
})