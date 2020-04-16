var mongoose= require("mongoose");
var passportlocalmongoose= require("passport-local-mongoose")
var userschema= new mongoose.Schema({
    username: {type: String, unique:true , required: true},
    password: String,
    firstname: String,
    lastname: String,
    email: { type:String, unique:true , required: true},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isadmin: {type: Boolean, default: false}
});
userschema.plugin(passportlocalmongoose);
module.exports= mongoose.model("user",userschema);