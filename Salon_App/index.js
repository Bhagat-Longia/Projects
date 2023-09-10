// Required Imports
const express = require("express");
const app = express();
const path = require("path")
const mongoose = require("mongoose");
const session = require("express-session")
const User = require("./Models/users");
const bcrypt = require("bcrypt");



// Setup for connecting to database
mongoose.connect("mongodb://127.0.0.1:27017/salonApp")
    .then(() => {
        console.log("MONGO CONNECTION OPEN !");
    })
    .catch((err) => {
        console.log("MONGO CONNECTION ERROR !");
        console.log(err);
    })


// Setup for express app
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
// Need to understand sessions
app.use(session({ secret: "Not a good secret!" }));

app.listen(3000, () => {
    console.log("APP IS NOW LISTENING ON PORT:3000 !");
})

const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        res.redirect("/login");
    }
    else {
        next();
    }
}


// Routes:

// Route for making a user account
app.get("/register", (req, res) => {
    res.render("user/register")
})

// Route for saving a new user in the database and redirecting the new user to the bookings page
app.post("/register", async (req, res) => {
    const { username, email, phone, password } = req.body;
    const foundUser = await User.findOne({ email });
    if (foundUser) {
        console.log('User already exists!');
        return res.redirect('/register');
    }
    const user = new User({ username, email, phone, password })
    await user.save();
    req.session.user_id = user._id;
    res.redirect("/booking")
})

// Route for a user to login to their existing account and redirecting the user to the bookings page
app.get("/login", (req, res) => {
    res.render("user/login")
})

// Route for authenticating a user that is attempting to sign in.
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const validUser = await User.findAndValidate(email, password);
    if (validUser) {
        req.session.user_id = validUser._id;
        res.redirect("/booking");
    }
    else {
        res.redirect("/login")
    }
})

// Route for logging out a user
app.post("logout", (req, res) => {
    req.session.user_id = null;
    // Alternative: req.session.destroy();
    res.redirect("/login");
})

// Route for a signed-in user to book an appointment
app.get("/booking", requireLogin, async (req, res) => {
    res.render("user/booking")
})


// Route for viewing all users in the database
// app.get("/users", async (req, res) => {
//     const users = await User.find({});
//     res.render("user/index", { users });
// })

// // Route for a user to see his profile and appointments
// app.get("/users/:userId", async (req, res) => {
//     const { userId } = req.params;
//     const user = User.findById(userId);
//     res.render("user/show", { user })
// })