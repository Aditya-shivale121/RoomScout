const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({

    title: String,
    description: String,

    price: {
        type: Number, 
        min : 0,
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

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

   rating: {
    type: Number,
    min: 0,
    max: 5,
    required: true
  },

    available: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;