const mongoose = require("mongoose");
const { sampleListings } = require("../init/data");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/roomscout";

async function main() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connection successful");

        await initDB();

    } catch (err) {
        console.log(err);
    }
}

async function initDB() {
    await Listing.deleteMany({});
    await Listing.insertMany(sampleListings);
    console.log("Database initialized");
}

main();