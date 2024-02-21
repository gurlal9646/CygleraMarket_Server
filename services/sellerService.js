const { connect } = require("../utils/DataBase.js");
const { encryptPassword } = require("../utils/bcrypt.js");
const { Seller } = require("../utils/models/SellerInfo.js");
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

const registerSeller = async (seller) => {
  const { email } = seller;
  let result = new ApiResponse(ResponseCode.FAILURE, 0, "", null);
  logger.info(`Register Seller in service start ${Date.now()}`);
  try {
    if (await Seller.findOne({ email :{ $regex: email, $options: 'i' }})) {
      result.message = ResponseMessage.EXISTINGUSERMESSAGE;
      return result;
    } else {
      const counter = await Counter.findOneAndUpdate(
        { name: "sellerId" },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
      );
      seller.sellerId = counter.value;

      const { password, sellerId } = seller;
      const encryptedPassword = await encryptPassword(password);

      delete seller.password;
      //Adding data into seller table
      let dbResponse = await Seller.create(seller);

      //Adding data into Accessinfo table
      let accessInfo = new AccessInfo({
        email,
        password: encryptedPassword,
        sellerId: sellerId,
        roleId: Roles.SELLER,
      });

      const savedAccessInfo = await accessInfo.save();
      if (dbResponse._id && savedAccessInfo._id) {
        const { data } = await generateToken({
          email,
          password,
          roleId: Roles.SELLER,
        });
        result.code = ResponseCode.SUCCESS;
        result.message = ResponseMessage.NEWUSERMESSAGE;
        result.data = data;
      }
    }
  } catch (error) {
    logger.error(`Error during registration Seller: ${error}`);
    result.message = "Registration failed";
    result.subcode = ResponseSubCode.EXCEPTION;
  }
  logger.info(`Register Seller in service end ${Date.now()}`);
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


  const getSellerId = async (_id)=>{
    let dbResponse = await Seller.findOne({_id});
    console.log(dbResponse);
    if(dbResponse){
         return dbResponse.sellerId;
    }
    return 0;

  };

module.exports = { registerSeller,getSellerId };
