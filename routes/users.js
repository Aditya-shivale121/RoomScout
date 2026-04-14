const express = require("express");

const { saveRedirectUrl } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");
const userController = require("../controllers/users");

const router = express.Router();

router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

router.route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        userController.authenticate,
        userController.login
    );

router.route("/logout")
    .get(userController.logout);

module.exports = router;
