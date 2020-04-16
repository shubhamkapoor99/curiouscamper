var express= require("express");
var router= express.Router();
var Campground= require("../models/campgrounds");
var middleware=require("../middleware/index");
router.get("/campgrounds",function(req,res){
    Campground.find({},function(err,ca){
        if(err){
            console.log("error");
        }
        else{
            res.render("index",{c: ca, currentuser: req.user});
        }
    });
    
});
router.post("/campgrounds",function(req,res){
    var name=req.body.name;
    var p= req.body.price;
    var url=req.body.image;
    var description=req.body.description;
    var author={
        id:req.user.id,
        username: req.user.username
    }
    var n={name:name ,price:p, image:url, description:description, author:author}
    
    Campground.create(n,function(err,q){
        if(err){
            console.log("error")
        }
        else{
            //console.log(q);
            res.redirect("/campgrounds");
        }
    })
})
router.get("/campgrounds/new",middleware.log,function(req,res){
    res.render("new.ejs");
});



router.get("/campgrounds/:id",middleware.log,function(req,res){
    Campground.findById(req.params.id,function(err,a){
        if(err){
            console.log("error");
        }
        else{
            res.render("show",{c:a});
        }
    });
});


//EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit",middleware.owner,function(req,res){
    
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,f){
          res.render("edit",{Campground:f});
        });

    }
    else{
        res.redirect("/login");
    }
    
    

    
})




//UPDATE CAMPGROUND ROUTE


router.put("/campgrounds/:id",middleware.owner,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.Campground,function(err,up){
        if(err){
            res.redirect("/campgrounds");
        }
        else
        {
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});





//Destroy campground route
router.delete("/campgrounds/:id",middleware.owner,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds");
        }
    })
})





//For image upload











module.exports = router;
