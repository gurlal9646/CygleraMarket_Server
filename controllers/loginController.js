const { connect } = require("../utils/DataBase.js");
const { encryptPassword } = require("../utils/bcrypt.js");
const { Seller } = require("../utils/models/SellerInfo.js");
const ApiResponse = require('../utils/models/ApiResponse.js'); // Importing ApiResponse from the apiResponse.js file
const { Counter } = require("../utils/models/Counter.js");
const {ResponseCode, ResponseMessage,Roles} = require('../utils/Enums.js'); 
const { AccessInfo } = require('../utils/models/AccessInfo.js');


const loginController = async function(request,response){
    const { email , password } = request.body;
    if (!await AccessInfo.findOne({ email })) {
        const result = new ApiResponse(ResponseCode.FAILURE, ResponseMessage.NONEXISTINGUSER, ResponseMessage.NONEXISTINGUSERMESSAGE, null);
        response.json(result);
    }
    else{
        let userId;
        const userInfo = await AccessInfo.findOne({ email });
        if (userInfo.roleId == Roles.Seller){
            userId = userInfo.sellerId;

        }

    }
}










connect()
    .then((connectedClient) => {
        client = connectedClient;

        console.log("Connected to MongoDB Login router");
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB", err);

        process.exit(1); // Exit the application if the database connection fails
    });


module.exports = { loginController };