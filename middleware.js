const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/Expresserror");

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in first.");
        return res.redirect("/login");
    }

    next();
};

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    const isAdmin = Boolean(req.user?.isAdmin);

    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    res.locals.isLegacyListing = !listing.owner;
    res.locals.canClaimLegacyListing = !listing.owner && !isAdmin;
    res.locals.isAdminManagingListing = isAdmin;
    req.listing = listing;

    if (listing.owner && !listing.owner.equals(req.user._id) && !isAdmin) {
        req.flash("error", "You do not have permission to modify this listing.");
        return res.redirect(`/listings/${id}`);
    }

    if (!listing.owner && !isAdmin) {
        req.flash("error", "An admin must recover this legacy listing before it can be managed.");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    const isAdmin = Boolean(req.user?.isAdmin);

    if (!review) {
        throw new ExpressError(404, "Review not found");
    }

    if (!review.author.equals(req.user._id) && !isAdmin) {
        req.flash("error", "You do not have permission to modify this review.");
        return res.redirect(`/listings/${id}`);
    }

    next();
};
