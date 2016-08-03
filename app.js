var express = require("express");
var app = express();
app.set("view engine", "ejs");
app.get("/", function(req, res){
   res.render("landing"); 
});
app.get("/campgrounds", function(req, res) {
   var campgrounds = [
      {name: "Jordan Lake", img: "https://www.meritagehomes.com/legacy/raleigh-nc/legacy-at-jordan-lake/jordan-lake-1871.jpg.mxw605.mxh311.jpg"},
      {name: "Smoky Mounrain", img: "https://www.visitnc.com/resimg.php/imgcrop/2/35625/image/800/448/Smokies.jpg"}
   ];
   res.render("campgrounds", {campgrounds: campgrounds}); 
});
app.listen(process.env.PORT, process.env.IP, function() {
   console.log("YelpCamp server started!"); 
});