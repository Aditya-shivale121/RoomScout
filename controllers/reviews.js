const Listing = require("../models/listing");
const Review = require("../models/review");
const ExpressError = require("../utils/Expresserror");

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    const review = new Review({
        listing: id,
        author: req.user._id,
        rating: req.body.review.rating,
        body: req.body.review.body,
    });

    listing.reviews.push(review._id);

    await review.save();
    await listing.save();
    req.flash("success", "Review added successfully.");

    res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;

    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash("success", "Review deleted successfully.");

    res.redirect(`/listings/${id}`);
};
