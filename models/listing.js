const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({

    title: String,
    description: String,

    price: {
        type: Number,
        required: true
    },

    location: {
        address: String,
        city: String,
        area: String
    },

    images: [
        {
            url: String,
            filename: String
        }
    ],

    amenities: [String],

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    rating: {
        type: Number,
        default: 0
    },

    available: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;