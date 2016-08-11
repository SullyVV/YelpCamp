var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var mongoose = require("mongoose");
var Campground = require("./model/Campground");
var Comment = require("./model/Comment");
var seedDB = require("./seed");
//cnct to mongo db
mongoose.connect("mongodb://localhost/YelpCamp");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

seedDB();
app.get("/", function(req, res){
   res.render("landing");
});
//INDEX, show all campgrounds
app.get("/campgrounds", function(req, res) {
   //get all campgrounds from data get render
   Campground.find({}, function(err, allCampgrounds){
      if (err) {
         console.log(err);
      } else {
         res.render("campgrounds/index", {campgrounds: allCampgrounds});
      }
   });
});
//CREATE, add new campgrounds to db
app.post("/campgrounds", function(req, res) {
   //get date from the form and send it to campgrounds array
   var name = req.body.name;
   var img = req.body.img;
   var desc = req.body.desc;
   var newCamp = {name: name, img: img, desc: desc};
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
app.get("/campgrounds/new", function(req, res) {
   res.render("campgrounds/new");
});
//SHOW, show details about one campground
app.get("/campgrounds/:id", function(req, res) {
   //find the campground in index which triggers it by using req.params.id
   Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp) {
      if (err) {
         console.log(err);
      } else {
         res.render("campgrounds/show", {foundCampground: foundCamp});
      }
   });
});
//====================================================
//COMMENTS ROUTES
//====================================================
//comments new route
app.get("/campgrounds/:id/comments/new", function(req, res) {
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
app.post("/campgrounds/:id/comments", function(req, res){
   Campground.findById(req.params.id, function(err, foundCamp){
      if (err) {
         console.log(err);
      } else {
         Comment.create(req.body.comment, function(err, comment){
            if (err) {
               console.log(err);
            } else {
                  foundCamp.comments.push(comment);
                  foundCamp.save()
                  res.redirect("/campgrounds/" + req.params.id);
            }
         });
      }
   });
});


// set listener for this server
app.listen(process.env.PORT, process.env.IP, function() {
   console.log("YelpCamp server started!"); 
});   
