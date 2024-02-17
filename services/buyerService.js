const { connect } = require("../utils/DataBase.js");
const { encryptPassword } = require("../utils/bcrypt.js");
const { Buyer } = require("../utils/models/BuyerInfo.js");
const { Counter } = require("../utils/models/Counter.js");
const ApiResponse = require("../utils/models/ApiResponse.js");
const {
  ResponseCode,
  ResponseSubCode,
  ResponseMessage,
  Roles,
} = require("../utils/Enums.js");
const { AccessInfo } = require("../utils/models/AccessInfo.js");
const { generateToken } = require("../services/tokenService");
const logger = require("../utils/logger.js");

const registerBuyer = async (buyer) => {
  const { email } = buyer;
  let result = new ApiResponse(ResponseCode.FAILURE, 0, "", null);
  logger.info(`Register Buyer in service start ${Date.now()}`);
  try {
    if (await Buyer.findOne({ email :{ $regex: email, $options: 'i' }})) {
      result.message = ResponseMessage.EXISTINGUSERMESSAGE;
      return result;
    } else {
      const counter = await Counter.findOneAndUpdate(
        { name: "buyerId" },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
      );
      buyer.buyerId = counter.value;

      const { password, buyerId } = buyer;
      const encryptedPassword = await encryptPassword(password);

      delete buyer.password;
      //Adding data into buyer table
      let dbResponse = await Buyer.create(buyer);

      //Adding data into Accessinfo table
      let accessInfo = new AccessInfo({
        email,
        password: encryptedPassword,
        buyerId: buyerId,
        roleId: Roles.BUYER,
      });

      const savedAccessInfo = await accessInfo.save();
      if (dbResponse._id && savedAccessInfo._id) {
        const { data } = await generateToken({
          email,
          password,
          roleId: Roles.BUYER,
        });
        result.code = ResponseCode.SUCCESS;
        result.message = ResponseMessage.NEWUSERMESSAGE;
        result.data = data;
      }
    }
  } catch (error) {
    logger.error(`Error during registration Buyer: ${JSON.stringify(error)}`);
    result.message = "Registration failed";
    result.subcode = ResponseSubCode.EXCEPTION;
  }
  logger.info(`Register Buyer in service end ${Date.now()}`);
  return result;
};

const getAllBuyers = async () => {
  let result = new ApiResponse(ResponseCode.FAILURE, 0, "", null);
  try {
    logger.info(`Get Buyers in service start ${Date.now()}`);
    // Fetch all buyers from the database
    let buyers = await Buyer.find();

    if (buyers.length === 0) {
      result.message = ResponseMessage.NODATAFOUND;
    } else {
      result.code = ResponseCode.SUCCESS;
      result.data = buyers;
    }
  } catch (error) {
    // Handle errors if any occur during the database operation
    logger.error(`Error fetching buyers: ${error}`);
    result.message = "Error fetching buyers";
    result.subcode = ResponseSubCode.EXCEPTION;
  }
  logger.info(`Get Buyers in service end ${Date.now()}`);
  return result;
};

connect()
  .then((connectedClient) => {
    client = connectedClient;
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);

    process.exit(1); // Exit the application if the database connection fails
  });

module.exports = { registerBuyer, getAllBuyers };
