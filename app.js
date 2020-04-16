var e= require("express");
var app= e();
app.set("view engine","ejs");
var Campground=require("./models/campgrounds");
var mongoose= require("mongoose");

mongoose.connect(process.env.DATABASEURL,{useNewUrlParser:true, useUnifiedTopology:true});

var passport= require("passport"),
localstrategy=require("passport-local"),
user = require("./models/user"),
methodoverride = require("method-override"),
flash= require("connect-flash");
var bodyParser= require("body-parser");

require('dotenv').config()



app.use(bodyParser.urlencoded({extended: true}));
app.use(e.static(__dirname + "/public"));
app.use(methodoverride("_method"));



var campgroundroutes= require("./routes/campgrounds");
var indexroutes= require("./routes/index");

//Passport config
app.use(require("express-session")({
    secret: "I am the best again",
    resave: false,
    saveUninitialized:false
}));


app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use(function(req,res,next){
    res.locals.currentuser= req.user;
    res.locals.error= req.flash("error");
    res.locals.success= req.flash("success");
    next();
})



app.use(indexroutes);
app.use(campgroundroutes);

const port= process.env.PORT || 3000;

app.listen(port,process.env.IP);
