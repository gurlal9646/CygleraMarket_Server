require("dotenv").config();
const port = process.env.PORT;
const express = require("express");

const app = express();
app.use(express.json());

app.set("view engine", "ejs");
//Testing commits
const apiRouter = require("./routes/api");

// Mount routers
app.use("/api", apiRouter);
app.use("/", apiRouter);
app.use((req, res, next) => {
  res.render("404");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
