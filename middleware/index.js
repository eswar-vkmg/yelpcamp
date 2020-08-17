var Campground  = require("../models/campground"),
    Comment     = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated())
        return next();
    else{
        req.flash("error", "You must be logged in first !")
        res.redirect("/login");
    }
}

middlewareObj.checkCampOwnership = function(req, res, next) {
    // if user logged in
    if (req.isAuthenticated()) {
        //fetch campground
        Campground.findById(req.params.id, function (err, foundCamp) {
            if (err)
                res.redirect("/campgrounds")
            else {
                // if user is owner of camp
                if (foundCamp.author.id.equals(req.user._id))
                    next();
                else{ // user is not owner of camp
                    req.flash("error", "You dont have permission to do that !")
                    res.redirect("back");
                }
            }

        })
    }
    else{ // user not logged in
        req.flash("error", "You must be logged in first !")
        res.redirect("back");
    }
}


middlewareObj.checkCommentOwnership =  function (req, res, next) {
    // if user logged in
    if (req.isAuthenticated()) {
        //fetch campground
        Comment.findById(req.params.comm_id, function (err, foundComment) {
            if (err)
                res.redirect("/campgrounds")
            else {
                // if user is owner of camp
                if (foundComment.author.id.equals(req.user._id))
                    next();
                else{ // user is not owner of camp
                    req.flash("error", "You dont have permission to do that !")
                    res.redirect("back");
                }
            }

        })
    }
    else{ // user not logged in
        req.flash("error", "You must be logged in first !")
        res.redirect("back");
    }
}

module.exports = middlewareObj;