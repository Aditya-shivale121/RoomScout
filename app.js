const express = require("express");

const app = express();
const mongoose = require("mongoose")
const PORT = 3000;
const Listing = require("../RoomScout/models/listing")
const path = require("path");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsMate = require("ejs-mate");

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
app.get("/testlisting", async (req, res) => {
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

        res.send("Test listing created");

    } catch (err) {
        console.log(err);
        res.send("Error creating listing");
    }
});

// index route
app.get("/listings",async (req,res) =>{
   const allListings = await Listing.find({});
   res.render("listings/index.ejs", {allListings});
});

// new route
app.get("/listings/new", (req ,res)=>{
    res.render("listings/new.ejs")
});

// save data
app.post("/listings", async (req, res) => {
    let data = req.body;

    // convert amenities to array
    data.amenities = data.amenities.split(",");

    const newListing = new Listing(data);
    await newListing.save();

    res.redirect("/listings");
});
// show route
app.get("/listings/:id" , async (req ,res) =>{
    const {id} = req.params;
    const listing = await Listing.findById(id); 
    res.render("listings/show", { listing });
});

//edit route
app.get("/listings/:id/edit",async (req,res)=>{
     const {id} = req.params;
    const listing = await Listing.findById(id); 
    res.render("listings/edit.ejs",{ listing })
});

app.put("/listings/:id", async (req, res) => {
    const { id } = req.params;

    let data = req.body;

    // fix amenities (string → array)
    data.amenities = data.amenities.split(",");

    await Listing.findByIdAndUpdate(id, data);

    res.redirect(`/listings/${id}`);
});

// delete listing
app.delete("/listings/:id", async (req, res) => {
    const { id } = req.params;

    await Listing.findByIdAndDelete(id);

    res.redirect("/listings");
});

