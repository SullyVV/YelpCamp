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
                  foundCamp.save();
                  res.redirect("/campgrounds/" + req.params.id);
            }
         });
      }
   });
});
// Edit Comments
router.get("/campgrounds/:id/comments/:cid/edit", checkUser, function(req, res){
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
router.put("/:cid", checkUser, function(req, res){
  // update comment with latest information and redirect to campground show page
  Comment.findByIdAndUpdate(req.params.cid, {
     text: req.body.text
  }, function(err, newComment){
     if (err) {
        console.log(err);
     } else {
        res.redirect("/campgrounds/");
     }
  });
});
// Destroy Comments
router.delete("/:cid", checkUser, function(req, res){
   Comment.findByIdAndRemove(req.params.cid, function(err){
      if (err) {
         console.log(err);
      } else {
         res.redirect("/campgrounds/");
      }
   });
});

//middleware
function checkUser(req, res, next) {
   if (req.isAuthenticated()) {
      Comment.findById(req.params.cid, function(err, foundComment) {
         if (err) {
            console.log(err);
         } else {
            if (foundComment.author.id.equals(req.user._id)){
               next();
            } else {
               res.redirect("back");
            }
         }
      });
   } else {
      res.redirect("back");
   }
}
function isLoggedin(req, res, next){
   if (req.user) {
      return next();
   } else {
      res.redirect("/login");
   }
}

module.exports = router;