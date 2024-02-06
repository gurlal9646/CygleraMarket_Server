
const express = require("express");

const router = express.Router();

const { connect } = require("../../utils/DataBase.js");

const { User } = require("../../utils/models/UserInfo.js");

const{encryptPassword,comparePasswords} =  require("../../utils/bcrypt.js");


router.post("/login", async (request, response) => {
    try {
      const user = await User.findOne({ username: request.body.email });
      if (!user) {
        return response.status(401).send("User not found");
      }
  
      const passwordMatch = await comparePasswords(
        request.body.password,
        user.password
      );
  
      if (passwordMatch) {
        const options = {
          maxAge: 1000 * 60 * 30,
          httpOnly: true,
          signed: true,
        };
        response.cookie("IsLogin", "true", options);
        response.redirect("/dashboard");
      } else {
        response.status(401).send("Username or password is incorrect.");
      }
    } catch (error) {
      console.error("Login error:", error);
      response.status(500).send("Internal server error");
    }
  });
  

  
  router.post("/register", async function (request, response) {
    if (await User.findOne({ username: request.body.email })) {
      return response.send(
        "Username already exists. Please choose a different username."
      );
    }
    let dbResponse = await User.create({
      username: request.body.email,
      password: await encryptPassword(request.body.password),
    });
  
    if (dbResponse.username) {
      const options = {
        maxAge: 1000 * 60 * 30,
        httpOnly: true,
        signed: true,
      };
      response.cookie("IsLogin", "true", options);
      response.redirect("/dashboard");
    }
  });

  connect()
  .then((connectedClient) => {
    client = connectedClient;
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);

    process.exit(1); // Exit the application if the database connection fails
  });
module.exports = router;