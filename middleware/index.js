var middlewareobj={};
var Campground=require("../models/campgrounds")
middlewareobj.owner= function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,f){
            if(err){
                req.flash("error","Campground Not Found");
                res.redirect("/");
            }
            else{
                
                if(f.author.id.equals(req.user.id) || req.user.isadmin){
                next();
             }
            else{
                req.flash("error","You don't have the permission to do that, Only the Owner can do that!!")
                res.redirect("back");
            }
            }
        });

    }
    else{
        req.flash("error","You Need To Be Logged In")
        res.redirect("/");
    }
}


middlewareobj.log= function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You Need To Be Logged In");
    res.redirect("/login");
}

module.exports= middlewareobj;