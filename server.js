const express = require("express");
const app = express();
const session = require("express-session");
const PORT = 3000;
const mongoose = require("mongoose");

app.set("view engine", ejs);

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

const favouritesModel = mongoose.model("favourites", favouritesSchema);

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
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const userFound = usersArray.find(
        (user) => user.username === username && user.password === password
    );
    if (userFound) {
        req.session.user = userFound;
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
