const { connect } = require("../utils/DataBase.js");
const { encryptPassword } = require("../utils/bcrypt.js");
const { Buyer } = require("../utils/models/BuyerInfo.js");
const { Counter } = require("../utils/models/Counter.js");
const ApiResponse = require('../utils/models/ApiResponse.js'); 

const {ResponseCode, ResponseMessage, Roles} = require('../utils/Enums.js'); 
const { AccessInfo } = require("../utils/models/AccessInfo.js");


const register = async function (request, response) {
    const { email } = request.body;
    try
    {

    if (await Buyer.findOne({ email })) {
        const result = new ApiResponse(ResponseCode.FAILURE, ResponseMessage.EXISTINGUSER, ResponseMessage.EXISTINGUSERMESSAGE, null);
        return response.json(result);
    }
    console.log('hello');
    const counter = await Counter.findOneAndUpdate(
        { name: 'buyerId' },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
    );
    request.body.buyerId = counter.value;

    const {password, buyerId} = request.body;
    console.log(password);
    const encryptedPassword = await encryptPassword(password);

    console.log(encryptedPassword);

    let dbResponse = await Buyer.create(
        request.body
    );

    let accessInfo = new AccessInfo({
        email,
        password:encryptedPassword,
        buyerId:buyerId,
        roleId:Roles.BUYER
    })

    const savedAccessInfo = await accessInfo.save();

    if (dbResponse._id && savedAccessInfo._id) {
        const result = new ApiResponse(ResponseCode.SUCCESS, ResponseMessage.NEWUSER, ResponseMessage.NEWUSERMESSAGE, {"token":"sdsdjsdosndosdioids"});
        response.json(result);
    }

} catch(error){
    console.error('Error during registration:',error);
    response.status(500).json({ success: false, message: 'Registration failed', error: error.message });
};
}

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
