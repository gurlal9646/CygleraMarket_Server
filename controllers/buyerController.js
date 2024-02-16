const { connect } = require("../utils/DataBase.js");
const { encryptPassword } = require("../utils/bcrypt.js");
const { Buyer } = require("../utils/models/BuyerInfo.js");
const { Counter } = require("../utils/models/Counter.js");
const ApiResponse = require("../utils/models/ApiResponse.js");
const { ResponseCode, ResponseMessage, Roles } = require("../utils/Enums.js");
const { AccessInfo } = require("../utils/models/AccessInfo.js");
const loginController = require("./loginController.js");

const logger = require("../utils/logger.js");
const register = async function (request, response) {
  logger.info(`Register Buyer: ${JSON.stringify(request.body)}`);
  const { email } = request.body;
  try {
    if (await Buyer.findOne({ email })) {
      const result = new ApiResponse(
        ResponseCode.FAILURE,
        ResponseMessage.EXISTINGUSER,
        ResponseMessage.EXISTINGUSERMESSAGE,
        null
      );
      return response.json(result);
    }
    const counter = await Counter.findOneAndUpdate(
      { name: "buyerId" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );
    request.body.buyerId = counter.value;

    const { password, buyerId } = request.body;
    const encryptedPassword = await encryptPassword(password);

    delete request.body.password;
    let dbResponse = await Buyer.create(request.body);

    let accessInfo = new AccessInfo({
      email,
      password: encryptedPassword,
      buyerId: buyerId,
      roleId: Roles.BUYER,
    });

    const savedAccessInfo = await accessInfo.save();
    if (dbResponse._id && savedAccessInfo._id) {
      const { data } = await loginController.generateToken({
        email,
        password,
        roleId: Roles.BUYER,
      });
      const result = new ApiResponse(
        ResponseCode.SUCCESS,
        ResponseMessage.NEWUSER,
        ResponseMessage.NEWUSERMESSAGE,
        data
      );
      response.json(result);
    }
  } catch (error) {
    console.log(error);
    logger.error(`Error during registration Buyer: ${JSON.stringify(error)}`);
    response
      .status(500)
      .json({
        success: false,
        message: "Registration failed",
        error: error.message,
      });
  }
};

const getBuyers = async (request, response) => {
  let apiResponse = new ApiResponse(ResponseCode.FAILURE, 0, "", null);
  try {
    logger.info(`Get Buyers enters:`);
    // Fetch all buyers from the database
    let buyers = await Buyer.find();

    if (buyers.length === 0) {
      apiResponse.message = ResponseMessage.NODATAFOUND;
    } else {
      apiResponse.code = ResponseCode.SUCCESS;
      apiResponse.data = buyers;
    }
    response.json(apiResponse);
  } catch (error) {
    // Handle errors if any occur during the database operation
    logger.error(`Error fetching buyers: ${JSON.stringify(error)}`);
    response.status(500).json(apiResponse);
  }
};

connect()
  .then((connectedClient) => {
    client = connectedClient;
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);

    process.exit(1); // Exit the application if the database connection fails
  });

module.exports = { register, getBuyers };
