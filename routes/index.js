var express = require("express");
var router = express.Router();
var User = require("../model/User");
var passport = require("passport");
router.get("/", function(req, res){
   res.render("landing");
});
//==============================================================================
// authentication
//==============================================================================
//new register form
router.get("/register", function(req, res) {
   res.render("register");
});
//handle regiser request
router.post("/register", function(req, res){
   //register user with username and hashed password
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
      if (err){
         console.log(err);
         req.flash("error", err.message);
         res.redirect("register");
      } else {
         //login using "local" strategy with new username
         console.log("register success");
         req.flash("success", "Successfully registered");
         passport.authenticate("local")(req, res, function(){
            console.log("login success");
            req.flash("success", "Logged in as: " + user.username);
            res.redirect("/campgrounds");
         });
      }
   });
});
//new login form
router.get("/login", function(req, res){
   res.render("login");
});
// handle login request
router.post("/login", passport.authenticate("local", {
   successRedirect: "/campgrounds",
   failRedirect: "/login"
}), function(req, res){});
// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Successfully Logged out");
   res.redirect("/campgrounds");
});

module.exports = router;