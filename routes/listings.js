const express = require("express");

const { isLoggedIn, isOwner } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");
const { validateListing } = require("../schema");
const listingController = require("../controllers/listings");
const upload = require("../utils/upload");

const router = express.Router();

function buildListingPayload(req, res, next) {
    const incomingListing = req.body.listing || {};
    const listing = {
        title: incomingListing.title ?? req.body.title,
        description: incomingListing.description ?? req.body.description,
        price: incomingListing.price ?? req.body.price,
        location: incomingListing.location || {
            address: req.body["location[address]"],
            city: req.body["location[city]"],
            area: req.body["location[area]"],
        },
        amenities: incomingListing.amenities ?? req.body.amenities,
        rating: incomingListing.rating ?? req.body.rating,
        available: incomingListing.available ?? req.body.available,
    };
    const locationCoordinates = normalizeLocationCoordinates(
        incomingListing.locationCoordinates || req.body.locationCoordinates
    );

    if (locationCoordinates) {
        listing.locationCoordinates = locationCoordinates;
    }

    normalizeAmenities(listing);
    const deleteImages = Array.isArray(req.body.deleteImages)
        ? req.body.deleteImages
        : req.body.deleteImages
            ? [req.body.deleteImages]
            : [];

    req.body = { listing, deleteImages };
    next();
}

function normalizeAmenities(data) {
    if (typeof data.amenities === "string") {
        data.amenities = data.amenities
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
    }
}

function normalizeLocationCoordinates(data = {}) {
    if (!data.latitude || !data.longitude) {
        return undefined;
    }

    return {
        latitude: data.latitude,
        longitude: data.longitude,
    };
}

router.get("/testlisting", isLoggedIn, wrapAsync(listingController.createTestListing));

router.get("/", wrapAsync(listingController.index));

router.get("/listings/new", isLoggedIn, listingController.renderNewForm);

router.route("/listings")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.array("images", 8), buildListingPayload, validateListing, wrapAsync(listingController.createListing));

router.route("/listings/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.array("images", 8), buildListingPayload, validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

router.get("/listings/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
