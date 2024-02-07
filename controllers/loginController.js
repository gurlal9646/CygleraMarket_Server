require("dotenv").config();
const jwt = require("jsonwebtoken");
const { connect } = require("../utils/DataBase.js");
const { encryptPassword, comparePasswords } = require("../utils/bcrypt.js");
const { Seller } = require("../utils/models/SellerInfo.js");
const ApiResponse = require("../utils/models/ApiResponse.js"); // Importing ApiResponse from the apiResponse.js file
const { Counter } = require("../utils/models/Counter.js");
const {
  ResponseCode,
  ResponseSubCode,
  ResponseMessage,
  Roles,
} = require("../utils/Enums.js");
const { AccessInfo } = require("../utils/models/AccessInfo.js");
const logger = require('../utils/logger.js')


const loginController = async function (request, response) {
  logger.info(`Login Request: ${request.body}`);
  const { email, password, roleId } = request.body;
  let userInfo;
  if (!(await AccessInfo.findOne({ email }))) {
    const result = new ApiResponse(
      ResponseCode.FAILURE,
      ResponseSubCode.USERNOTEXISTS,
      ResponseMessage.NONEXISTINGUSERMESSAGE,
      null
    );
    response.json(result);
  } else {
    if (roleId == 0 || roleId == undefined) {
      userInfo = await AccessInfo.find({ email });
      if (userInfo.length > 1) {
        const result = new ApiResponse(
          ResponseCode.FAILURE,
          ResponseSubCode.MULTIPLEACCOUNT,
          ResponseMessage.MULTIPLEACCOUNT,
          null
        );
        return response.json(result);
      }
    } else {
      userInfo = await AccessInfo.find({ email, roleId });
    }


    if (await comparePasswords(password, userInfo[0].password)) {
      const token = jwt.sign(
        {
          userId: userInfo.sellerId > 0 ? userInfo.sellerId : userInfo.buyerId,
          email: userInfo.email,
          role: userInfo.roleId,
        },
        process.env.SECRET_KEY
      );
      const result = new ApiResponse(
        ResponseCode.SUCCESS,
        ResponseMessage.LOGINUSER,
        ResponseMessage.LOGINUSERMESSAGE,
        { token }
      );
      response.json(result);
    } else {

      const result = new ApiResponse(
        ResponseCode.FAILURE,
        ResponseMessage.LOGINFAILED,
        ResponseMessage.WRONGPASSMESSAGE,
        null
      );
      response.json(result);
    }
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

module.exports = { loginController };
