var mongoose=require("mongoose");

var yelp= new mongoose.Schema({
    name:String,
    image:String,
    price:String,
    description:String,
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        username:String
    }
});

module.exports= mongoose.model("Campground",yelp);