var express= require("express");
var router= express.Router();
var passport= require("passport");
var user= require("../models/user");
var Campground= require("../models/campgrounds"),
async=require("async"),
nodemailer= require("nodemailer"),
crypto= require("crypto");


router.get("/",function(req,res){
    res.render("landing");
    
});

//===========
//AUTH ROUTES
//===========
router.get("/register",function(req,res){
    res.render("register");
})

router.post("/register",function(req,res){
    var newus= new user({username: req.body.username, firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email });
  
    
    
user.register(newus,req.body.password,function(err,User){
    if(err){
        req.flash("error",err.message);
        res.redirect("/register");
    }
    passport.authenticate("local")(req,res,function(){
        req.flash("success","Welcome to Yelp camp "+User.username);
        res.redirect("/campgrounds");
    });
});
});
//Show login form

router.get("/login",function(req,res){
    
    res.render("login");
    
});

router.post("/login",passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}),function(req,res){
});

router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged you out");
    res.redirect("/");
})


//USER  PROFILE

router.get("/users/:id",function(req,res){
    user.findById(req.params.id,function(err,f){
        
            Campground.find().where('author.id').equals(f.id).exec(function(err,c){
                if(err){
                    req.flash("error","Something went wrong");
                    res.redirect("/");
                }
                res.render("userprofile",{theuser:f, c:c});
            })
            
        
    })
})


router.get("/forgot",function(req,res){
    res.render("forgot");
})




router.post('/forgot', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        user.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: 'shubhamkapoor4011@gmail.com',
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'shubhamkapoor4011@gmail.com',
          subject: 'Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account[Curious Camper].\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log('mail sent');
          req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.[Check Spam Folder Also]');
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/forgot');
    });
  });
  
  router.get('/reset/:token', function(req, res) {
    user.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset', {token: req.params.token});
    });
  });
  
  router.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        user.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
          if(req.body.password === req.body.confirm) {
            user.setPassword(req.body.password, function(err) {
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
  
              user.save(function(err) {
                req.logIn(user, function(err) {
                  done(err, user);
                });
              });
            })
          } else {
              req.flash("error", "Passwords do not match.");
              return res.redirect('back');
          }
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: 'shubhamkapoor4011@gmail.com',
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'shubhamkapoor4011@gmail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed on Curious Camper.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/campgrounds');
    });
  });





router.get("/contact",function(req,res){
  res.render("contact");
});










module.exports = router;