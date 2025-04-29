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

app.get("/", (req, res) => {
    app.get("/login,html");
});

const usersArray = [
    { username: "admin1", password: "admin1" },
    { username: "admin2", password: "admin2" },
    { username: "user1", password: "password1" },
    { username: "user2", password: "password2" },
    { username: "user3", password: "password3" },
];
