if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const listingRouter = require("./routes/listings");
const reviewRouter = require("./routes/reviews");
const userRouter = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.ATLASDB_URL;

// ================= FIXED STORE =================
const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    crypto: {
        secret: process.env.SESSION_SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("ERROR in MONGO SESSION", err);
});

// ================= SESSION =================
const sessionOptions = {
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
};

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessionOptions));
app.use(flash());

// ================= PASSPORT =================
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ================= GLOBAL MIDDLEWARE =================
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// ================= ROUTES =================
app.use("/", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Something went wrong";

    if (req.get("referer")) {
        req.flash("error", message);
        return res.redirect(req.get("referer"));
    }

    res.status(status).render("listings/error", {
        err: { status, message, stack: err.stack },
    });
});

// ================= ADMIN CREATION =================
async function ensureAdminUser() {
    const adminUsername = process.env.ADMIN_USERNAME?.trim();
    const adminEmail = process.env.ADMIN_EMAIL?.trim();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminEmail || !adminPassword) return;

    const existingAdmin = await User.findOne({
        $or: [{ username: adminUsername }, { email: adminEmail }],
    });

    if (existingAdmin) {
        let shouldSave = false;

        if (!existingAdmin.isAdmin) {
            existingAdmin.isAdmin = true;
            shouldSave = true;
        }

        if (!existingAdmin.email) {
            existingAdmin.email = adminEmail;
            shouldSave = true;
        }

        if (shouldSave) {
            await existingAdmin.save();
            console.log(`Admin user updated: ${existingAdmin.username}`);
        }

        return;
    }

    const adminUser = new User({
        username: adminUsername,
        email: adminEmail,
        isAdmin: true,
    });

    await User.register(adminUser, adminPassword);
    console.log(`Admin user created: ${adminUsername}`);
}

// ================= SERVER START =================
async function startServer() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to DB");

        await ensureAdminUser();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.log("Database connection failed");
        console.log(err);
    }
}

startServer();