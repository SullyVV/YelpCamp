var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var mongoose = require("mongoose");
//cnct to mongo db
mongoose.connect("mongodb://localhost/YelpCamp");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
//create a simple schema for campgound
var CampgroundSchema = new mongoose.Schema({
   name: String,
   img: String,
   desc: String
});
//create model based on the schema
var Campground = mongoose.model("Campground", CampgroundSchema);
//create two inital data in the database;
// Campground.create({
//    name: "Jordan Lake",
//    img: "https://www.meritagehomes.com/legacy/raleigh-nc/legacy-at-jordan-lake/jordan-lake-1871.jpg.mxw605.mxh311.jpg",
//    desc: "Jordan Lake State Recreation Area is a North Carolina state park spanning Chatham County, and Wake County North Carolina in the United States. It comprises 4,558 acres of woodlands along the shores of 13,940-acre Jordan Lake."
// }, function(err, newCamp){
//    if(err){
//       console.log(err);
//    } else {
//       console.log("created first inital data");
//    }
// });
// Campground.create({
//    name: "Smoky Mounrain",
//    img: "https://www.visitnc.com/resimg.php/imgcrop/2/35625/image/800/448/Smokies.jpg",
//    desc: "Great Smoky Mountains National Park straddles the border of North Carolina and Tennessee. The sprawling landscape encompases lush forests and an abundance of wildflowers that bloom year-round. Streams, rivers and waterfalls appear along hiking routes that include a segment of the Appalachian Trail. An observation tower tops Clingmans Dome, the highest peak, offering scenic views of the mist-covered mountains."
// }, function(err, newCamp){
//    if(err){
//       console.log(err);
//    } else {
//       console.log("created first inital data");
//    }
// });
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
         res.render("index", {campgrounds: allCampgrounds});
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
   res.render("new");
});
//SHOW, show details about one campground
app.get("/campgrounds/:id", function(req, res) {
   //find the campground in index which triggers it 
   //by using req.params.id
   Campground.findById(req.params.id, function(err, foundID) {
      if(err) {
         console.log(err);
      } else {
         res.render("show", {foundCampground: foundID});
      }
   })
})
app.listen(process.env.PORT, process.env.IP, function() {
   console.log("YelpCamp server started!"); 
});   