const mongoose=require("mongoose");
const Schema  = mongoose.Schema;
//this is the basic schema
const listingSchema= new Schema({
    title:{type:String,
        required:true,
    },
    description:String,
    image:{type:String,
        default:"https://www.pexels.com/photo/house-lights-turned-on-106399/",
        set:(v)=>v==="" ?"https://www.pexels.com/photo/house-lights-turned-on-106399/":v,//we set this link for client
    },
    price:Number,
    location:String,
    country:String,
});

const listing=mongoose.model("Listing",listingSchema);
module.exports=listing;
