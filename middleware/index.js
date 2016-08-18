var Comment = require("../model/Comment");
var Campground = require("../model/Campground");
var middlewareobj = {};
middlewareobj.isLoggedin = function(req, res, next) {
    if (req.user) {
      return next();
   } else {
      req.flash("error", "Please login first");
      res.redirect("/login");
   }
};
middlewareobj.checkCommentUser = function(req, res, next) {
  if (req.isAuthenticated()) {
      Comment.findById(req.params.cid, function(err, foundComment) {
         if (err) {
            console.log(err);
         } else {
            if (foundComment.author.id.equals(req.user._id)){
               next();
            } else {
               req.flash("error", "You don't have authority");
               res.redirect("back");
            }
         }
      });
   } else {
      req.flash("error", "Please login first");
      res.redirect("back");
   }  
};
middlewareobj.checkCampgroundUser = function(req, res, next) {
  if (req.isAuthenticated()) {
      Campground.findById(req.params.cid, function(err, foundCompground) {
         if (err) {
            console.log(err);
         } else {
            if (foundCompground.author.id.equals(req.user._id)){
               next();
            } else {
               req.flash("error", "You don't have the authority");
               res.redirect("back");
            }
         }
      });
   } else {
      req.flash("error", "Please login first");
      res.redirect("back");
   }  
};
module.exports = middlewareobj;