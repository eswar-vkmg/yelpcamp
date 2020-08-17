var express = require("express")
var router = express.Router({mergeParams : true});
var Campground = require("../models/campground")
var Comment = require("../models/comment")
var middlewareObj = require("../middleware")


// Render form for creating new comment
router.get("/new", middlewareObj.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, camp) {
        if (err)
            console.log(err);
        else{
            res.render("comments/new", { campground: camp })
        }
    })
})

// Create the comment
router.post("/", middlewareObj.isLoggedIn, function (req, res) {
    // retrieve post by id // create new comment // link comment with campground // save changes to campground // redirect to show camp id
    Campground.findById(req.params.id, function (err, camp) {
        if (err)
            console.log(err)
        else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err)
                    console.log(err)
                else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    camp.comments.push(comment);
                    camp.save();
                    req.flash("success", "New comment successfully added !");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            })
        }
    })

})

router.delete("/:comm_id", middlewareObj.checkCommentOwnership, function(req, res){
    Comment.findByIdAndDelete(req.params.comm_id, function(err){
        if(err){
            console.log(err)
            res.redirect("back") 
        }
        else{
            req.flash("success", "Comment successfully deleted !")
            res.redirect("/campgrounds/"+req.params.id);
        }    
    })
})




module.exports = router;
