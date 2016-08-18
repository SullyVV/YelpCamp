var express = require("express");
var router = express.Router();
var Campground = require("../model/Campground");
var Comment = require("../model/Comment");
var middlewareobj = require("../middleware");
//====================================================
//COMMENTS ROUTES
//====================================================
//comments new route
router.get("/campgrounds/:id/comments/new", middlewareobj.isLoggedin, function(req, res) {
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
router.post("/campgrounds/:id/comments", middlewareobj.isLoggedin, function(req, res){
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
                  foundCamp.save();
                  req.flash("success", "New Comment Posted");
                  res.redirect("/campgrounds/" + req.params.id);
            }
         });
      }
   });
});
// Edit Comments
router.get("/campgrounds/:id/comments/:cid/edit", middlewareobj.checkCommentUser, function(req, res){
   //render an edit form
   var campid = req.params.id;
   var cid = req.params.cid;
   Comment.findById(cid, function(err, foundComment){
      if (err){
         console.log(err);
      } else {
         res.render("comments/edit", {
            campgroundId: campid, 
            comment: foundComment});
      }
   });
});
// Update Comments
router.put("/:cid", middlewareobj.checkCommentUser, function(req, res){
  // update comment with latest information and redirect to campground show page
  Comment.findByIdAndUpdate(req.params.cid, {
     text: req.body.text
  }, function(err, newComment){
     if (err) {
        console.log(err);
     } else {
        req.flash("success", "Successfully updated comment");
        res.redirect("/campgrounds/");
     }
  });
});
// Destroy Comments
router.delete("/:cid", middlewareobj.checkCommentUser, function(req, res){
   Comment.findByIdAndRemove(req.params.cid, function(err){
      if (err) {
         req.flash("error", err.message);
      } else {
         req.flash("success", "Successfully destroyed campground");
      }
      res.redirect("/campgrounds/");
   });
});

module.exports = router;