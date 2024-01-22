const { connect } = require("../utils/DataBase.js");
const { encryptPassword } = require("../utils/bcrypt.js");
const { Seller } = require("../utils/models/SellerInfo.js");



const sellerRegister = async function (request, response) {
    console.log(request.body);
    if (await Seller.findOne({ email: request.body.email })) {
        return response.send(
            "Username already exists. Please choose a different username."
        );
    }
    let dbResponse = await Seller.create(
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

        console.log("Connected to MongoDB Seller router");
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB", err);

        process.exit(1); // Exit the application if the database connection fails
    });


module.exports = { sellerRegister };