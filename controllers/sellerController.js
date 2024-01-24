const { connect } = require("../utils/DataBase.js");
const { encryptPassword } = require("../utils/bcrypt.js");
const { Seller } = require("../utils/models/SellerInfo.js");
const ApiResponse = require('../utils/models/ApiResponse.js'); // Importing ApiResponse from the apiResponse.js file



const sellerRegister = async function (request, response) {
    //console.log(request.body);
    const { email } = request.body;
    console.log(email)
    if (await Seller.findOne({ email})) {
        const result = new ApiResponse(0, "USER_ALREADY_EXISTS", "User with this email already exists", null);
        response.json(result);    }
    let dbResponse = await Seller.create(
        request.body
    );
    console.log(dbResponse);

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