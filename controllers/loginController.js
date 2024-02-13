require("dotenv").config();
const jwt = require("jsonwebtoken");
const { connect } = require("../utils/DataBase.js");
const { comparePasswords } = require("../utils/bcrypt.js");
const { Seller } = require("../utils/models/SellerInfo.js");
const ApiResponse = require("../utils/models/ApiResponse.js"); // Importing ApiResponse from the apiResponse.js file
const {
  ResponseCode,
  ResponseSubCode,
  ResponseMessage,
  Roles,
} = require("../utils/Enums.js");
const { AccessInfo } = require("../utils/models/AccessInfo.js");
const logger = require('../utils/logger.js');
const { Buyer } = require("../utils/models/BuyerInfo.js");



const Token = async function (request, response) {
  logger.info(`Login Request: ${JSON.stringify(request.body)}`);
  const { email, password, roleId } = request.body;
  const tokenResponse  = await generateToken({ email, password, roleId });
  response.json(tokenResponse);

};


const generateToken = async ({ email, password, roleId })=>{
  
  let accessInfo;
  if (!(await AccessInfo.findOne({ email }))) {
    const result = new ApiResponse(
      ResponseCode.FAILURE,
      ResponseSubCode.USERNOTEXISTS,
      ResponseMessage.NONEXISTINGUSERMESSAGE,
      null
    );
    return result;
  } else {
    if (roleId == 0 || roleId == undefined) {
      accessInfo = await AccessInfo.find({ email });
      if (accessInfo.length > 1) {
        const result = new ApiResponse(
          ResponseCode.FAILURE,
          ResponseSubCode.MULTIPLEACCOUNT,
          ResponseMessage.MULTIPLEACCOUNT,
          null
        );
        return result;
      }
    } else {

      accessInfo = await AccessInfo.findOne({ email, roleId });
    }


    if (await comparePasswords(password, accessInfo.password)) {

      let userInfo;
      switch(accessInfo.roleId) {
        case Roles.SELLER:
          userInfo = await Seller.findOne({sellerId: accessInfo.sellerId });
          break;

          case Roles.BUYER:
            userInfo = await Buyer.findOne({buyerId: accessInfo.buyerId });
            break;

        // Add other role cases if needed
        default:
          break;
      }
      const token = jwt.sign(
        {
          userId: accessInfo.sellerId > 0 ? accessInfo.sellerId : accessInfo.buyerId,
          email: accessInfo.email,
          roleId: accessInfo.roleId,
        },
        process.env.SECRET_KEY
      );
      const result = new ApiResponse(
        ResponseCode.SUCCESS,
        ResponseMessage.LOGINUSER,
        ResponseMessage.LOGINUSERMESSAGE,
        {
          token,
          roleId,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          email: accessInfo.email
        }
      );
      return result;
    } else {

      const result = new ApiResponse(
        ResponseCode.FAILURE,
        ResponseMessage.LOGINFAILED,
        ResponseMessage.WRONGPASSMESSAGE,
        null
      );
      return result;
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

module.exports = { Token,generateToken };
