var express = require("express");
var router = express.Router();
var Campground = require("../model/Campground");
//INDEX, show all campgrounds
router.get("/campgrounds", function(req, res) {
   //get all campgrounds from data get render
   Campground.find({}, function(err, allCampgrounds){
      if (err) {
         console.log(err);
      } else {
         res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
      }
   });
});
//CREATE, add new campgrounds to db
router.post("/campgrounds", isLoggedin, function(req, res) {
   //get date from the form and send it to campgrounds array
   var name = req.body.name;
   var img = req.body.img;
   var desc = req.body.desc;
   var author = {
       id: req.user._id,
       username: req.user.username
   }
   var newCamp = {name: name, img: img, desc: desc, author: author};
   Campground.create(newCamp, function(err, newC){
      if (err) {
         console.log(err);
      } else {
         //redirect to campground
         res.redirect("/campgrounds");
      }
   });
});
//NEW, display form
router.get("/campgrounds/new", isLoggedin, function(req, res) {
   res.render("campgrounds/new");
});
//SHOW, show details about one campground
router.get("/campgrounds/:id", function(req, res) {
   //find the campground in index which triggers it by using req.params.id
   Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp) {
      if (err) {
         console.log(err);
      } else {
         res.render("campgrounds/show", {foundCampground: foundCamp});
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