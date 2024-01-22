const { connect } = require("../utils/DataBase.js");
const { encryptPassword } = require("../utils/bcrypt.js");
const { Buyer } = require("../utils/models/BuyerInfo.js");



const register = async function (request, response) {
    console.log(request.body);
    if (await Buyer.findOne({ email: request.body.email })) {
        return response.send(
            "Username already exists. Please choose a different username."
        );
    }
    let dbResponse = await Buyer.create(
        request.body
    );

    if (dbResponse.username) {
        const options = {
            maxAge: 1000 * 60 * 30,
            httpOnly: true,
            signed: true,
        };
        response.cookie("IsLogin", "true", options);
        response.redirect("/dashboard");
    }
};



connect()
    .then((connectedClient) => {
        client = connectedClient;

        console.log("Connected to MongoDB buyers router");
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB", err);

        process.exit(1); // Exit the application if the database connection fails
    });


module.exports = { register };