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
