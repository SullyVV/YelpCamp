var express = require("express");
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "ejs");
var campgrounds = [
      {name: "Jordan Lake", img: "https://www.meritagehomes.com/legacy/raleigh-nc/legacy-at-jordan-lake/jordan-lake-1871.jpg.mxw605.mxh311.jpg"},
      {name: "Smoky Mounrain", img: "https://www.visitnc.com/resimg.php/imgcrop/2/35625/image/800/448/Smokies.jpg"},
      {name: "Jordan Lake", img: "https://www.meritagehomes.com/legacy/raleigh-nc/legacy-at-jordan-lake/jordan-lake-1871.jpg.mxw605.mxh311.jpg"},
      {name: "Smoky Mounrain", img: "https://www.visitnc.com/resimg.php/imgcrop/2/35625/image/800/448/Smokies.jpg"},
      {name: "Jordan Lake", img: "https://www.meritagehomes.com/legacy/raleigh-nc/legacy-at-jordan-lake/jordan-lake-1871.jpg.mxw605.mxh311.jpg"},
      {name: "Smoky Mounrain", img: "https://www.visitnc.com/resimg.php/imgcrop/2/35625/image/800/448/Smokies.jpg"},
      {name: "Jordan Lake", img: "https://www.meritagehomes.com/legacy/raleigh-nc/legacy-at-jordan-lake/jordan-lake-1871.jpg.mxw605.mxh311.jpg"},
      {name: "Smoky Mounrain", img: "https://www.visitnc.com/resimg.php/imgcrop/2/35625/image/800/448/Smokies.jpg"}
   ];
app.get("/", function(req, res){
   res.render("landing");
});
app.get("/campgrounds", function(req, res) {
   
   res.render("campgrounds", {campgrounds: campgrounds}); 
});
app.post("/campgrounds", function(req, res) {
   //get date from the form and send it to campgrounds array
   var name = req.body.name;
   var img = req.body.img;
   var newCamp = {name: name, img: img};
   campgrounds.push(newCamp);
   //redirect to campground
   res.redirect("/campgrounds");
});
app.get("/campgrounds/new", function(req, res) {
   res.render("new");
});
app.listen(process.env.PORT, process.env.IP, function() {
   console.log("YelpCamp server started!"); 
});   