var mongoose = require("mongoose");
//create a simple schema for campgound
var CampgroundSchema = new mongoose.Schema({
   name: String,
   img: String,
   desc: String,
   //reference by ObjectId
   comments: [{
       type: mongoose.Schema.Types.ObjectId,
       ref: "Comment"
   }]
});
//create model based on the schema, created a collection of this name "Campground"
module.exports = mongoose.model("Campground", CampgroundSchema);