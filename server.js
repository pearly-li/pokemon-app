const express = require("express");
var session = require("express-session");
const app = express();
app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);
app.set("view engine", "ejs");

const PORT = 3000;

/* app.METHOD(path, callback [, callback ...]) */
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
    res.redirect("/home");
});

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/login.html");
});

const usersArray = [
    { username: "admin1", password: "admin1" },
    { username: "admin2", password: "admin2" },
    { username: "user1", password: "password1" },
    { username: "user2", password: "password2" },
    { username: "user3", password: "password3" },
];
app.use(express.urlencoded({ extended: true }));
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = usersArray.find(
        (user) => user.username === username && user.password === password
    );
    if (user) {
        req.session.user = user;
        res.render("home.ejs", { username: user.username });
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
app.get("home", (req, res) => {
    res.render("home.ejs", { username: req.session.user.username });
});
