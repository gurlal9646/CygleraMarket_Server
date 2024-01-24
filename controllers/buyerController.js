const { connect } = require("../utils/DataBase.js");
const { encryptPassword } = require("../utils/bcrypt.js");
const { Buyer } = require("../utils/models/BuyerInfo.js");
const { Counter } = require("../utils/models/Counter.js");
const ApiResponse = require('../utils/models/ApiResponse.js'); 

const {ResponseCode, ResponseMessage} = require('../utils/Enums.js'); 


const register = async function (request, response) {
    const { email } = request.body;
    if (await Buyer.findOne({ email })) {
        const result = new ApiResponse(ResponseCode.FAILURE, ResponseMessage.EXISTINGUSER, ResponseMessage.EXISTINGUSERMESSAGE, null);
        response.json(result);
    }
    console.log('hello');
    const counter = await Counter.findOneAndUpdate(
        { name: 'buyerId' },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
    );
    request.body.buyerId = counter.value;
    let dbResponse = await Buyer.create(
        request.body
    );

    if (dbResponse._id) {
        const result = new ApiResponse(ResponseCode.SUCCESS, ResponseMessage.NEWUSER, ResponseMessage.NEWUSERMESSAGE, {"token":"sdsdjsdosndosdioids"});
        response.json(result);
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
