var express = require("express");
var router = express.Router();
var Campground = require("../model/Campground");
var Comment = require("../model/Comment");
//====================================================
//COMMENTS ROUTES
//====================================================
//comments new route
router.get("/campgrounds/:id/comments/new", isLoggedin, function(req, res) {
   //find campground and send to new form
   Campground.findById(req.params.id, function(err, foundCamp) {
      if (err) {
         console.log(err);
      } else {
         res.render("comments/new", {campground: foundCamp});
      }
   });
});

// comments create route
router.post("/campgrounds/:id/comments", isLoggedin, function(req, res){
   Campground.findById(req.params.id, function(err, foundCamp){
      if (err) {
         console.log(err);
      } else {
         Comment.create(req.body.comment, function(err, comment){
            if (err) {
               console.log(err);
            } else {
                  // add user id and username to comment
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  // save comment
                  comment.save();
                  foundCamp.comments.push(comment);
                  foundCamp.save()
                  res.redirect("/campgrounds/" + req.params.id);
            }
         });
      }
   });
});

//middleware
function isLoggedin(req, res, next){
   if (req.user) {
      return next();
   } else {
      res.redirect("/login");
   }
}

module.exports = router;