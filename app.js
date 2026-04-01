const express = require("express");

const app = express();
const mongoose = require("mongoose")
const PORT = 3000;
const Listing = require("../RoomScout/models/listing")
const path = require("path");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/Expresserror.js");
const wrapAsync = require("./utils/wrapAsync");
const { validateListing, validateReview } = require("./schema");
const Review = require("../RoomScout/models/review");

const MONGO_URL = 'mongodb://127.0.0.1:27017/roomscout';

// routes

app.get("/", (req, res) => {
    res.send("Server is running");
});


async function startServer() {
    try{
        await mongoose.connect(MONGO_URL);
        console.log("Connected to DB");

        app.listen(PORT ,() =>{
            console.log(`Server is running on port ${PORT}`)
        });
    }catch (err){
        console.log("Database connection failed");
        console.log(err);
    }
    
}

startServer();

app.engine('ejs', ejsMate);
app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));



// sample listing
app.get("/testlisting", wrapAsync ( async(req, res) => {
    try {

        const sampleListing = new Listing({
            title: "Single Room near DY Patil",
            description: "Clean PG with WiFi and parking",

            price: 5000,

            location: {
                address: "Nigdi pradhikaran",
                city: "Pune",
                area: "Akurdi"
            },

            images: [
                {
                    url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
                    filename: "room1"
                }
            ],

            amenities: ["WiFi", "Parking", "Laundry"],

            rating: 4.2,
            available: true
        });

        await sampleListing.save();
        console.log("Sample listing ID:", sampleListing._id);

        // Seed sample review
        const sampleReview = new Review({
            listing: sampleListing._id,
            author: new mongoose.Types.ObjectId(), // dummy author
            rating: 5,
            body: "Great room! Clean and comfortable with good amenities."
        });
        await sampleReview.save();
        console.log("Sample review created");

        res.send(`Test listing created (ID: ${sampleListing._id}). Sample review also added.`);

    } catch (err) {
        console.log(err);
        res.send("Error creating listing");
    }
}));

// index route
app.get("/listings",wrapAsync ( async (req,res) =>{
   const allListings = await Listing.find({});
   res.render("listings/index.ejs", {allListings});
}));

// new route
app.get("/listings/new", (req ,res)=>{
    res.render("listings/new.ejs")
});

// save data
app.post("/listings", validateListing, wrapAsync(async (req, res) => {
    let data = req.body.listing;

    // convert amenities to array
    if (data.amenities) {
        data.amenities = data.amenities.split(",");
    }

    const newListing = new Listing(data);
    await newListing.save();
    res.redirect("/listings");
}));
// show route
app.get("/listings/:id" , wrapAsync(async (req ,res) =>{
    const {id} = req.params;
    const listing = await Listing.findById(id).populate('reviews'); 
    res.render("listings/show", { listing });
}));

//edit route
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
     const {id} = req.params;
    const listing = await Listing.findById(id); 
    res.render("listings/edit.ejs",{ listing })
}));

app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;

    let data = req.body.listing;

    // fix amenities (string → array)
    if (data.amenities) {
        data.amenities = data.amenities.split(",");
    }

    await Listing.findByIdAndUpdate(id, { ...data });

    res.redirect(`/listings/${id}`);
}));

// delete listing
app.delete("/listings/:id",wrapAsync(async (req, res) => {
    const { id } = req.params;
    
    // Cascade delete reviews first
    const listing = await Listing.findById(id).populate('reviews');
    if (listing && listing.reviews && listing.reviews.length > 0) {
        await Review.deleteMany({ _id: { $in: listing.reviews.map(r => r._id) } });
    }
    
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

// create review
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError("Listing not found", 404);
    }

    const review = new Review({ 
        listing: id, 
        author: new mongoose.Types.ObjectId(),
        rating: req.body.review.rating, 
        body: req.body.review.body 
    });

    listing.reviews.push(review._id);

    await review.save();
    await listing.save();

    res.redirect(`/listings/${id}`);
}));

// delete review
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    res.redirect(`/listings/${id}`);
}));




// all routes above

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).send(message);
});
