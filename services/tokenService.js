const { connect } = require("../utils/DataBase.js");
const jwt = require("jsonwebtoken");
const { AccessInfo } = require("../utils/models/AccessInfo.js");
const { Seller } = require("../utils/models/SellerInfo.js");
const { Buyer } = require("../utils/models/BuyerInfo.js");
const { comparePasswords } = require("../utils/bcrypt.js");
const {
  ResponseCode,
  ResponseSubCode,
  ResponseMessage,
  Roles,
} = require("../utils/Enums.js");
const ApiResponse = require("../utils/models/ApiResponse.js");
const logger = require("../utils/logger.js");

async function generateToken({ email, password, roleId }) {
  let accessInfo;
  let result = new ApiResponse(ResponseCode.FAILURE, 0, "", null);

  try {
    logger.info(`generateToken in service: ${(email, password, roleId)}`);

    if (!(await AccessInfo.findOne({ email: { $regex: email, $options: 'i' }}))) {
      result.subcode = ResponseSubCode.USERNOTEXISTS;
      result.message = ResponseMessage.NONEXISTINGUSERMESSAGE;
      return result;
    } else {
      if (!roleId || roleId <= 0) {
        accessInfo = await AccessInfo.find({ email: { $regex: email, $options: 'i' }});
        if (accessInfo.length > 1) {
          result.subcode = ResponseSubCode.MULTIPLEACCOUNT;
          result.message = ResponseMessage.MULTIPLEACCOUNT;
          return result;
        } else {
          accessInfo = accessInfo[0];
        }
      } else {
        accessInfo = await AccessInfo.findOne({ email: { $regex: email, $options: 'i' }, roleId });
      }
      if (await comparePasswords(password, accessInfo.password)) {
        let userInfo;
        switch (accessInfo.roleId) {
          case Roles.SELLER:
            userInfo = await Seller.findOne({ sellerId: accessInfo.sellerId });
            break;
          case Roles.BUYER:
            userInfo = await Buyer.findOne({ buyerId: accessInfo.buyerId });
            break;
          // Add other role cases if needed
          default:
            break;
        }

        const token = jwt.sign(
          {
            userId:
              accessInfo.sellerId > 0
                ? accessInfo.sellerId
                : accessInfo.buyerId,
            email: accessInfo.email,
            roleId: accessInfo.roleId,
          },
          process.env.SECRET_KEY
        );

        result.code = ResponseCode.SUCCESS;
        result.message = ResponseMessage.LOGINUSERMESSAGE;
        result.data = {
          token,
          roleId: accessInfo.roleId,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          email: accessInfo.email,
        };
        return result;
      } else {
        result.message = ResponseMessage.WRONGPASSMESSAGE;
        return result;
      }
    }
  } catch (error) {
    logger.error(`Error occurred in generateToken: ${error}`);
    result.code = ResponseCode.FAILURE;
    result.subcode = 100;
  }
  return result;
}

connect()
  .then((connectedClient) => {
    client = connectedClient;
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);

    process.exit(1); // Exit the application if the database connection fails
  });

module.exports = { generateToken };
