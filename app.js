var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/YelpCamp");
app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "ejs");
//set up a simple schema for campgrounds
var CampgroundSchema = new mongoose.Schema({
   name: String,
   img: String
});
//make this schema into a model
var Campground = mongoose.model("Campground", CampgroundSchema);
//put two inital campgrounds into database
// Campground.create({
//    name: "Jordan Lake",
//    img: "https://www.meritagehomes.com/legacy/raleigh-nc/legacy-at-jordan-lake/jordan-lake-1871.jpg.mxw605.mxh311.jpg"
// }, function(err, newCamp){
//    if(err) {
//       console.log(err);
//    } else {
//       console.log(newCamp);
//    }
// });
// Campground.create({
//    name: "Smoky Mounrain",
//    img: "https://www.visitnc.com/resimg.php/imgcrop/2/35625/image/800/448/Smokies.jpg"
// }, function(err, newCamp){
//    if(err) {
//       console.log(err);
//    } else {
//       console.log(newCamp);
//    }
// });
app.get("/", function(req, res){
   res.render("landing");
});
app.get("/campgrounds", function(req, res) {
   //get campgrounds from database and render them to the page
   Campground.find({}, function(err, campgrounds){
      if (err) {
         console.log(err);
      } else {
         res.render("campgrounds", {campgrounds: campgrounds});
      }
   })
});
app.post("/campgrounds", function(req, res) {
   //get date from the form and send it to campgrounds array
   var name = req.body.name;
   var img = req.body.img;
   var newCamp = {name: name, img: img};
   console.log("upload new camp");
   //write new campground into database
   Campground.create(newCamp, function(err, newC){
      if(err){
         console.log(err);
      } else {
         //redirect to campground
         res.redirect("/campgrounds");
      }
   });
});
app.get("/campgrounds/new", function(req, res) {
   res.render("new");
});
app.listen(process.env.PORT, process.env.IP, function() {
   console.log("YelpCamp server started!"); 
});