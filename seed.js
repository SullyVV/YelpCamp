var mongoose = require("mongoose");
var Campground = require("./model/Campground");
var Comment  = require("./model/Comment");
//data used to seed up the db
var data = [
    {
        name: "Jordan Lake",
        img: "https://www.meritagehomes.com/legacy/raleigh-nc/legacy-at-jordan-lake/jordan-lake-1871.jpg.mxw605.mxh311.jpg",
        desc: "Jordan Lake State Recreation Area is a North Carolina state park spanning Chatham County, and Wake County North Carolina in the United States. It comprises 4,558 acres of woodlands along the shores of 13,940-acre Jordan Lake."
    },
    {
      name: "Smoky Mounrain",
      img: "https://www.visitnc.com/resimg.php/imgcrop/2/35625/image/800/448/Smokies.jpg",
      desc: "Great Smoky Mountains National Park straddles the border of North Carolina and Tennessee. The sprawling landscape encompases lush forests and an abundance of wildflowers that bloom year-round. Streams, rivers and waterfalls appear along hiking routes that include a segment of the Appalachian Trail. An observation tower tops Clingmans Dome, the highest peak, offering scenic views of the mist-covered mountains."
    }
    ];


function seedDB() {
    //remove all data in the database
    Campground.remove({}, function(err, newdb){
        if (err) {
            console.log(err);
        } else {
            console.log("Campground DB cleared");
        }
    });
    Comment.remove({}, function(err, newdb){
        if (err) {
            console.log(err);
        } else {
            console.log("Comment DB cleared");
        }
    });
    
    // add new campgrounds in the database
    data.forEach(function(eachCamp){
        Campground.create(eachCamp, function(err, newCamp){
            if (err) {
                console.log(err);
            } else {
                console.log("add new campground");
                Comment.create({
                    text: "this is a nice place, but would be bettwe with internet",
                    author: "Dong"
                }, function(err, newComment){
                    if (err) {
                        console.log(err);
                    } else {
                        //associate comment with campground
                        newCamp.comments.push(newComment);
                        newCamp.save();
                        console.log("add new Comments");
                    }
                });
            }
        });
    });
    //add commnents
}
module.exports = seedDB;