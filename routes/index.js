var express = require("express")
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//Route route
router.get("/", function (req, res) {
    res.render("landing")
})


//Register route
router.get("/register", function (req, res) {
    res.render("register");
})

router.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username })
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err.message)
            req.flash("error", err.message)
            return res.redirect("/register")
        }
        else
            passport.authenticate("local")(req, res, function () {
                req.flash("success", "Successfully registered !")
                res.redirect("/campgrounds");
            })
    })
})


//Login route
router.get("/login", function (req, res) {
    res.render("login");
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true,
}), function (req, res) {
})  

//Logout Route
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Succesfully logged out !")
    res.redirect("/campgrounds");
})

module.exports = router;