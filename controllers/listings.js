const fs = require("fs/promises");
const path = require("path");

const { cloudinary, hasCloudinaryConfig } = require("../cloudConfig");
const Listing = require("../models/listing");
const Review = require("../models/review");
const ExpressError = require("../utils/Expresserror");
const { buildGeometryFromCoordinates, geocodeListingLocation, hasLocationChanged } = require("../utils/geocode");

const localUploadsDirectory = path.join(__dirname, "..", "public", "uploads");

function formatLocalUploadedImages(files = []) {
    return files.map((file) => ({
        url: `/uploads/${file.filename}`,
        filename: file.filename,
    }));
}

function uploadToCloudinary(file) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "RoomScout_DEV",
                resource_type: "image",
            },
            (err, result) => {
                if (err) {
                    return reject(err);
                }

                resolve({
                    url: result.secure_url,
                    filename: result.public_id,
                });
            }
        );

        stream.end(file.buffer);
    });
}

async function persistUploadedImages(files = []) {
    if (files.length === 0) {
        return [];
    }

    if (!hasCloudinaryConfig) {
        return formatLocalUploadedImages(files);
    }

    return Promise.all(files.map((file) => uploadToCloudinary(file)));
}

async function destroyListingImages(images = []) {
    await Promise.all(images.map((image) => destroyStoredImage(image)));
}

async function destroyImagesByFilename(filenames = []) {
    const targets = filenames.filter(Boolean);
    await Promise.all(
        targets.map((filename) =>
            destroyStoredImage({ filename })
        )
    );
}

async function destroyStoredImage(image = {}) {
    if (!image.filename) {
        return;
    }

    if (image.url && image.url.startsWith("/uploads/")) {
        const localPath = path.join(localUploadsDirectory, path.basename(image.filename));
        await fs.unlink(localPath).catch(() => null);
        return;
    }

    if (hasCloudinaryConfig && cloudinary) {
        await cloudinary.uploader.destroy(image.filename).catch(() => null);
    }
}

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res) => {
    const { locationCoordinates, ...data } = req.body.listing;
    const uploadedImages = await persistUploadedImages(req.files || []);

    if (uploadedImages.length === 0) {
        throw new ExpressError(400, "Please upload at least one room image.");
    }

    const submittedGeometry = buildGeometryFromCoordinates(locationCoordinates);
    const geocodedLocation = submittedGeometry ? null : await geocodeListingLocation(data.location);
    const newListing = new Listing(data);

    if (submittedGeometry) {
        newListing.geometry = submittedGeometry;
        newListing.geocodedAddress = [data.location?.address, data.location?.area, data.location?.city].filter(Boolean).join(", ");
    } else if (geocodedLocation) {
        newListing.geometry = geocodedLocation.geometry;
        newListing.geocodedAddress = geocodedLocation.geocodedAddress;
    }

    newListing.images = uploadedImages;
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Listing created successfully.");

    res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate("owner")
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        });

    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    res.render("listings/show", { listing });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const { locationCoordinates, ...data } = req.body.listing;
    const listing = req.listing || await Listing.findById(id);
    const isAdmin = Boolean(req.user?.isAdmin);
    let successMessage = "Listing updated successfully.";
    const deleteImages = Array.isArray(req.body.deleteImages)
        ? req.body.deleteImages
        : req.body.deleteImages
            ? [req.body.deleteImages]
            : [];

    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    const submittedGeometry = buildGeometryFromCoordinates(locationCoordinates);
    const shouldGeocode = !submittedGeometry && (hasLocationChanged(listing.location, data.location) || !listing.geometry?.coordinates?.length);
    const geocodedLocation = shouldGeocode ? await geocodeListingLocation(data.location) : null;

    listing.set(data);

    if (!listing.owner && !isAdmin) {
        listing.owner = req.user._id;
        successMessage = "Legacy listing claimed and updated successfully.";
    } else if (!listing.owner && isAdmin) {
        successMessage = "Legacy listing updated successfully by admin.";
    }

    if (submittedGeometry) {
        listing.geometry = submittedGeometry;
        listing.geocodedAddress = [data.location?.address, data.location?.area, data.location?.city].filter(Boolean).join(", ");
    } else if (shouldGeocode) {
        listing.geometry = geocodedLocation?.geometry;
        listing.geocodedAddress = geocodedLocation?.geocodedAddress;
    }

    if (deleteImages.length > 0) {
        listing.images = listing.images.filter((image) => !deleteImages.includes(image.filename));
        await destroyImagesByFilename(deleteImages);
    }

    const uploadedImages = await persistUploadedImages(req.files || []);

    if (uploadedImages.length > 0) {
        listing.images.push(...uploadedImages);
    }

    await listing.save();
    req.flash("success", successMessage);

    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");

    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    if (listing && listing.reviews.length > 0) {
        await Review.deleteMany({ _id: { $in: listing.reviews.map((review) => review._id) } });
    }

    await destroyListingImages(listing.images);
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully.");
    res.redirect("/listings");
};

module.exports.createTestListing = async (req, res) => {
    const sampleListing = new Listing({
        title: "Single Room near DY Patil",
        description: "Clean PG with WiFi and parking",
        price: 5000,
        location: {
            address: "Nigdi pradhikaran",
            city: "Pune",
            area: "Akurdi",
        },
        images: [
            {
                url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
                filename: "room1",
            },
        ],
        amenities: ["WiFi", "Parking", "Laundry"],
        rating: 4.2,
        available: true,
        owner: req.user._id,
    });

    await sampleListing.save();
    console.log("Sample listing ID:", sampleListing._id);

    const sampleReview = new Review({
        listing: sampleListing._id,
        author: req.user._id,
        rating: 5,
        body: "Great room! Clean and comfortable with good amenities.",
    });

    await sampleReview.save();
    sampleListing.reviews.push(sampleReview._id);
    await sampleListing.save();
    console.log("Sample review created");

    res.send(`Test listing created (ID: ${sampleListing._id}). Sample review also added.`);
};
