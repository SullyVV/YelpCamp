var express = require("express");
var bodyParser = require("body-parser");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var app = express();
var mongoose = require("mongoose");
var Campground = require("./model/Campground");
var Comment = require("./model/Comment");
var seedDB = require("./seed");
var User = require("./model/User");
//cnct to mongo db
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/YelpCamp");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
//search for /public directory
app.use(express.static(__dirname + "/public"));
seedDB();
app.get("/", function(req, res){
   res.render("landing");
});
//passport configuration
app.use(require("express-session")({
   secret: "keyboard cat",
   resave: false,
   saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// this middleware must come after configuration of passport, otherwise req.user is always null
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
})

//INDEX, show all campgrounds
app.get("/campgrounds", function(req, res) {
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
app.get("/campgrounds/:id/comments/new", isLoggedin, function(req, res) {
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
app.post("/campgrounds/:id/comments", isLoggedin, function(req, res){
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
//==============================================================================
// authentication
//==============================================================================
//new register form
app.get("/register", function(req, res) {
   res.render("register");
});
//handle regiser request
app.post("/register", function(req, res){
   //register user with username and hashed password
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
      if (err){
         console.log(err);
         res.redirect("register");
      } else {
         //login using "local" strategy with new username
         console.log("register success");
         passport.authenticate("local")(req, res, function(){
            console.log("login success");
            res.redirect("/campgrounds");
         });
      }
   })
})
//new login form
app.get("/login", function(req, res){
   res.render("login");
});
// handle login request
app.post("/login", passport.authenticate("local", {
   successRedirect: "/campgrounds",
   failRedirect: "/login"
}), function(req, res){});
// logout route
app.get("/logout", function(req, res){
   req.logout();
});
//middleware
function isLoggedin(req, res, next){
   if (req.user) {
      return next();
   } else {
      res.redirect("/login");
   }
}
// set listener for this server
app.listen(process.env.PORT, process.env.IP, function() {
   console.log("YelpCamp server started!"); 
});   
