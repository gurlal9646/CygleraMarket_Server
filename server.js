require("dotenv").config();
const port = process.env.PORT;
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

app.set("view engine", "ejs");

app.use("/", express.static("src"));
app.use("/assets/css", express.static("css"));
app.use("/assets/images", express.static("images"));
app.use("/js", express.static("js"));
const COOKIE_KEY = process.env.COOKIE_KEY;

app.use(cookieParser(COOKIE_KEY));

app.use(express.urlencoded({ extended: true }));

// Import routers

const apiRouter = require("./routes/api");

const webRouter = require("./routes/web");

// Mount routers

app.use("/api", apiRouter);

app.use("/", webRouter);

app.use((req, res, next) => {
  res.render("404");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
