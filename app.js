//step requirement
const express= require("express");
const app= express();
const path=require("path");
const methodOverride = require("method-override");
const ejsMate= require("ejs-mate");
const wrapAsync =require("./utils/wrapAsync.js");
const ExpressError =require("./utils/ExpressError.js");
const cors = require("cors");


const mongoose = require('mongoose');
const Listing=require("./models/listing.js");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"
main().then(()=>{
    console.log("connected to DB");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
};

//step5
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"public")));
app.use(cors());



//step3
app.get("/",(req,res)=>{
    res.send("this the the root server");
});
//step4 index route
app.get("/listings",async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings})
    
});

//step7 New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");

});

//step6 show route
// app.get("/listings/:id",wrapAsync(async(req,res)=>{
//     let {id}=req.params;
//     const listing=await Listing.findById(id);
//     res.render("listings/show.ejs",{listing});

// }));
app.get("/listings/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    
    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ExpressError(404, "Listing Not Found!"));
    }

    const listing = await Listing.findById(id);
    if (!listing) {
        return next(new ExpressError(404, "Listing Not Found!"));
    }

    res.render("listings/show.ejs", { listing });
}));

//step8 Create Route
app.post("/listings",
    wrapAsync(async(req,res,next)=>{//sbse phle wrapAsync create route ke liye use hua hai
    //const { title, description, image, price, country, location } = req.body; // Extract form data
        if(!req.body.listing){
            throw new ExpressError(400,"please send valid data for listings");
        }
        const newListing=new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");

}));
//step9 Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  }));

//step10//Update Route
app.put("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  }));

//step11//Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  }));  



//step2
// app.get("/testListing",async(req,res)=>{
//     let sampleListing= new Listing({
//         title:"My ne Villa",
//         description:"This is a beautiful villa with a pool",
//         price:1000,
//         location:"Paris",
//         country:"france",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("sample was saved");
// });
//step 13
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page Not Found!"));
})

//step 12
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs",{err});
    // res.status(statusCode).send(message);
});

//step 1
app.listen(8080,()=>{
    console.log("server is running on port 8080");
});

