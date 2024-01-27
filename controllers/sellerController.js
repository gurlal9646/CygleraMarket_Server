const { connect } = require("../utils/DataBase.js");
const { encryptPassword } = require("../utils/bcrypt.js");
const { Seller } = require("../utils/models/SellerInfo.js");
const ApiResponse = require('../utils/models/ApiResponse.js'); // Importing ApiResponse from the apiResponse.js file
const { Counter } = require("../utils/models/Counter.js");
const {ResponseCode, ResponseMessage,Roles} = require('../utils/Enums.js'); 
const { AccessInfo } = require('../utils/models/AccessInfo.js');



const sellerRegister = async function (request, response) {
    //console.log(request.body);
    const { email} = request.body;
    console.log(email)
    try
    {

    if (await Seller.findOne({ email})) {
        const result = new ApiResponse(ResponseCode.FAILURE, ResponseMessage.EXISTINGUSER, ResponseMessage.EXISTINGUSERMESSAGE, null);
        response.json(result); }
    else {
        console.log('New Seller is being registerd');
    const counter = await Counter.findOneAndUpdate(
        { name: 'sellerId' },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
    );
    request.body.sellerId = counter.value;
    const { password,sellerId} = request.body;
    const encryptedPassword = await encryptPassword(password);

    
        let dbResponse = await Seller.create(
            request.body
        );
        let accessInfo = new AccessInfo({
            email,
            password:encryptedPassword,
            sellerId:sellerId,
            roleId:Roles.SELLER
        })
        const savedAccessInfo = await accessInfo.save();
        if (dbResponse._id && savedAccessInfo._id) {
            const result = new ApiResponse(ResponseCode.SUCCESS, ResponseMessage.NEWUSER, ResponseMessage.NEWUSERMESSAGE, {"token":"sdsdjsdosndosdioids"});
            response.json(result);  
        }
    }  
    } catch (error) {
        console.error('Error during registration:', error);
        response.status(500).json({ success: false, message: 'Registration failed', error: error.message });
    };
    }
    

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