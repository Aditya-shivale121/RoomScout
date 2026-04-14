const express = require("express");

const { isLoggedIn, isReviewAuthor } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");
const { validateReview } = require("../schema");
const reviewController = require("../controllers/reviews");

const router = express.Router({ mergeParams: true });

router.route("/")
    .post(isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

router.route("/:reviewId")
    .delete(isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;
