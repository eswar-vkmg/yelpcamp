var express = require("express")
var router = express.Router();
var Campground = require("../models/campground")
var middlewareObj = require("../middleware")


//Display all campgrounds
router.get("/", function (req, res) {
    Campground.find({}, function (err, allCamps) {
        if (err)
            console.log("theres an error")
        else {
            res.render("campgrounds/index", { campgrounds: allCamps, currUser: req.user })
        }
    })
})


// post route for creating new camp
router.post("/", middlewareObj.isLoggedIn, function (req, res) {
    var campName = req.body.name;
    var campImage = req.body.image;
    var campDesc = req.body.description;
    var author = {
        id : req.user._id,
        username : req.user.username
    }
    
    var newCamp = { name: campName, image: campImage, description: campDesc, author : author };

    Campground.create(newCamp, function (err, camp) {
        if (err)
            console.log("An error occured")
        else {
            req.flash("success", "Campground successfully created !")
            res.redirect("/campgrounds")
        }
    })
})

// render form for creating new campground
router.get("/new", middlewareObj.isLoggedIn,  function (req, res) {
    res.render("campgrounds/new.ejs");
})

// display particular campground
router.get("/:id", function (req, res) {
    var campId = req.params.id;

    Campground.findById(campId).populate("comments").exec(function (err, foundCamp) { // 
        if (err)
            console.log(err);
        else {
            res.render("campgrounds/show", { campground: foundCamp })
        }
    })
})

// Edit campground form
router.get("/:id/edit", middlewareObj.checkCampOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCamp){
        res.render("campgrounds/edit", {camp : foundCamp});
    })
})

// update campground
router.put("/:id", middlewareObj.checkCampOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err, updatedCamp){
        if(err)
            res.redirect("/campgrounds");
        else
            res.redirect("/campgrounds/"+req.params.id)
    })
})

// delete campground
router.delete("/:id", middlewareObj.checkCampOwnership, function(req, res){
   Campground.findByIdAndDelete(req.params.id, function(err){
        if(err)
            res.redirect("/campgrounds");
        else{
            req.flash("success", "Campground successfully deleted !")
            res.redirect("/campgrounds");
        }
   })
})

//middleware


module.exports = router;