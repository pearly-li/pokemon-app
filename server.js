const express = require("express");
const app = express();
const session = require("express-session");
const PORT = 3000;
const mongoose = require("mongoose");

app.set("view engine", "ejs");

app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);

main().catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/test");
}

const favouritesSchema = new mongoose.Schema({
    name: String,
    username: String,
});

const timelineSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: Date,
    username: String,
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
});

const favouritesModel = mongoose.model("favourites", favouritesSchema);

const timelineModel = mongoose.model("timelineEvents", timelineSchema);

const userModel = mongoose.model("users", userSchema);

/* app.METHOD(path, callback [, callback ...]) */
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
    res.redirect("/home");
});

const usersArray = [
    { username: "admin1", password: "admin1" },
    { username: "admin2", password: "admin2" },
    { username: "user1", password: "password1" },
    { username: "user2", password: "password2" },
    { username: "user3", password: "password3" },
];

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/login.html");
});

app.use(express.urlencoded({ extended: true }));

const addToTimeline = async (title, description, date, username) => {
    try {
        const timelineEvent = await timelineModel.create({
            title,
            description,
            date,
            username,
        });
        return timelineEvent;
    } catch (error) {
        console.error("Database error", error);
    }
};

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const userFound = usersArray.find(
        (user) => user.username === username && user.password === password
    );
    if (userFound) {
        req.session.user = userFound;
        try {
            await addToTimeline(
                "Login",
                "User logged in",
                new Date(),
                req.session.user.username
            );
            console.log("Adding timeline event for:", username);
        } catch (error) {
            console.error("Failed to add to timeline", error);
        }
        res.redirect("/home");
        // res.render("home.ejs", { username: req.session.user.username });
    } else {
        res.status(401).send("Invalid credentials");
    }
});

const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    } else {
        res.redirect("/login");
    }
};

app.use(isAuthenticated);
app.get("/home", (req, res) => {
    // console.log(req.session.user);
    res.render("home.ejs", { username: req.session.user.username });
});

app.get("/favourites", async (req, res) => {
    try {
        const favouritesFound = await favouritesModel.find({
            username: req.session.user.username,
        });
        res.json(favouritesFound);
    } catch (error) {
        console.log("Database error", error);
    }
});

app.get("/timeline", async (req, res) => {
    try {
        const timelineFound = await timelineModel.find({
            username: req.session.user.username,
        });
        res.json(timelineFound);
    } catch (error) {
        console.log("Database error", error);
    }
});

// : is dynamic route parameter signifier in ExpressJS
app.get("/addFavourite/:favourite", async (req, res) => {
    try {
        const alreadyExists = await favouritesModel.findOne({
            name: req.params.favourite,
            username: req.session.user.username,
        });
        if (!alreadyExists) {
            const favouritesAdd = await favouritesModel.create({
                name: req.params.favourite,
                username: req.session.user.username,
            });
            await addToTimeline(
                "Added Favourite",
                req.params.favourite,
                new Date(),
                req.session.user.username
            );
            res.status(200).json(favouritesAdd);
        } else {
            return res.status(409).json({ message: "Already in favourites" });
        }
    } catch (error) {
        console.log("Database error", error);
    }
});
