const express = require("express");
const app = express();
const PORT = 3000;

/* app.METHOD(path, callback [, callback ...]) */
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
    res.redirect("/home");
});

app.get("/home", (req, res) => {
    res.sendFile(__dirname + "/index.html");
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
        res.redirect("/home");
    } else {
        res.status(401).send("Invalid credentials");
    }
});

app.set("view engine", "ejs");
