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
// require route files where we define each routes.
var commentRouter = require("./routes/comment");
var indexRouter = require("./routes/index");
var campgroundRouter = require("./routes/campground");
//cnct to mongo db
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/YelpCamp");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
//search for /public directory
app.use(express.static(__dirname + "/public"));
//seedDB();   //used to seed up the database
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
// use routers exports by each router.
app.use(commentRouter);
app.use(indexRouter);
app.use(campgroundRouter);
// set listener for this server
app.listen(process.env.PORT, process.env.IP, function() {
   console.log("YelpCamp server started!"); 
});   
