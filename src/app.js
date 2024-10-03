const express = require("express");
const app = express();
const path = require("path");
const session = require('express-session');
const flash = require('connect-flash');
const exphbs = require('express-handlebars');
const port = process.env.PORT || 3000;
const hbs = require("hbs")
const collection = require("./db/conn");




const templatePath = path.join(__dirname, "../views");

app.use(express.static(templatePath));
app.use(express.json())
app.set("view engine", "hbs")
app.set("views", templatePath)
app.use(flash());
app.use(express.urlencoded({ extended: false }))

// ** Session Middleware Setup **
app.use(session({
    secret: 'X2$8jL^!4qZ3n@T7uB5#kV$w9rP&yM1J%',   // Replace with a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Set 'secure: true' in production if using HTTPS
}));



console.log(path.join(__dirname, "../views"));


// Middleware to check if user is logged in
function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/login_signup"); // Redirect to login if not authenticated
    }
    next(); // Proceed if authenticated
}


app.get("/login_signup", (req, res) => {
    res.render("login_signup", {
        signupError: req.flash('signupError'),
        loginError: req.flash('loginError'),
        successMessage: req.flash('successMessage')
    });
});





app.get("/login_signup", (req, res) => {
    res.render("login_signup");
});





app.get("/destination", requireLogin, (req, res) => {
    res.render("destination");
});
app.get("/contact", requireLogin, (req, res) => {
    res.render("contact");
});
app.get("/gallery", requireLogin, (req, res) => {
    res.render("gallery");
});
app.get("/historic_places", requireLogin, (req, res) => {
    res.render("historic_places");
});
app.get("/index", requireLogin, (req, res) => {
    res.render("index");
});
app.get("/beaches", requireLogin, (req, res) => {
    res.render("beaches");
});
app.get("/mountains", requireLogin, (req, res) => {
    res.render("mountains");
});
app.get("/cities", requireLogin, (req, res) => {
    res.render("cities");
});
app.get("/nature", requireLogin, (req, res) => {
    res.render("nature");
});
app.get("/deserts", requireLogin, (req, res) => {
    res.render("deserts");
});
app.get("/adventures", requireLogin, (req, res) => {
    res.render("adventures");
});
app.get("/lakes", requireLogin, (req, res) => {
    res.render("lakes");
});
app.get("/islands", requireLogin, (req, res) => {
    res.render("islands");
});

app.post("/signup", async (req, res) => {
    try {
        // Alternative syntax for destructuring
        const username = req.body.username;
        const password = req.body.password;
        const passwordConfirm = req.body.passwordConfirm;

        // Log the received data for debugging
        console.log("Signup data received:", { username, password, passwordConfirm });

        // Validate input
        if (!username || !password) {
            // return res.status(400).send("Missing required fields");
            req.flash('signupError', 'Missing required fields');
            return res.redirect("/login_signup");

        }

        if (password !== passwordConfirm) {
            // return res.status(400).send("Passwords do not match");
            req.flash('signupError', 'Passwords do not match');
            return res.redirect("/login_signup");

        }

        // Check if user already exists
        const existingUser = await collection.findOne({ username });
        if (existingUser) {
            // return res.status(400).send("User already exists");
            req.flash('signupError', 'User already exists');
            return res.redirect("/login_signup");
        }

        // Save new user to the database
        const data = { username, password };
        await collection.insertMany([data]);

        req.flash('successMessage', 'Signup successful! Please log in.');

        // Redirect or send a success response
        res.redirect("/login_signup");
    } catch (error) {
        console.error("Error during signup:", error); // Detailed logging
        res.status(500).send("Server error during sign up");
    }
});



app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await collection.findOne({ username });


        if (!user || user.password !== password) {
            // return res.status(401).send("Invalid email or password");
            req.flash('loginError', 'Invalid email or password || new user please Signup');
            return res.redirect('/login_signup');
        }

        req.session.user = { _id: user._id, username: user.username };
        console.log("Session data :", req.session.user);


        const referUser = await collection.findOne({ username });
        if(!referUser.refercode){
        const refercodeid = referUser._id;
        const refercodeidString = refercodeid.toString();
        const refercode = refercodeidString.substring(18);
        console.log("referid", refercode);
        referUser.refercode = refercode;
        await referUser.save();
        }

        // req.flash('successMessage', 'Login successful!');

        // res.render("index");
        res.redirect("/index"); // Redirect to the homepage after login
    } catch (error) {
        res.status(500).send("Server error during login");
    }
});










app.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect("/index");
        }
        res.redirect("/login_signup"); // Redirect to login page after logout
    });
});


app.get("*", (req, res) => {
    res.status(404).send("Opps page couldn't be found ");
});


app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
})
