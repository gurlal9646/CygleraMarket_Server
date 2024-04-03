const { connect } = require("../utils/DataBase.js");
const { encryptPassword } = require("../utils/bcrypt.js");
const { Seller } = require("../utils/models/SellerInfo.js");
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
const { v4: uuidv4 } = require('uuid');
const { sendEmail } = require("../utils/sendEmail.js");
const {
  EmailTemplateType,
  getEmailTemplate
} = require("../utils/EmailTemplates.js");


const registerSeller = async (seller) => {
  const { email } = seller;
  let result = new ApiResponse(ResponseCode.FAILURE, 0, "", null);
  logger.info(`Register Seller in service start ${new Date().toISOString()}`);
  try {
    if (await Seller.findOne({ email :{ $regex: email, $options: 'i' }})) {
      result.message = ResponseMessage.EXISTINGUSERMESSAGE;
      return result;
    } else {

      seller.sellerId = uuidv4();

      const { password, sellerId } = seller;
      const encryptedPassword = await encryptPassword(password);

      delete seller.password;
      //Adding data into seller table
      let dbResponse = await Seller.create(seller);

      const accessInfoId  = uuidv4();

      //Adding data into Accessinfo table
      let accessInfo = new AccessInfo({
        accessInfoId,
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

        const template = getEmailTemplate(EmailTemplateType.WELCOME_SUPPLIER);
        if(template){
          template.content = template.content.replace("$name", `${seller.firstName} ${seller.lastName} `);
          await sendEmail(seller.email, template.subject, template.content);
        }
      }
    }
  } catch (error) {
    logger.error(`Error during registration Seller: ${error}`);
    result.message = "Registration failed";
    result.subcode = ResponseSubCode.EXCEPTION;
  }
  logger.info(`Register Seller in service end ${new Date().toISOString()}`);
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

  const getAllSellers = async () => {
    let result = new ApiResponse(ResponseCode.FAILURE, 0, "", null);
    try {
      logger.info(`Get Sellers in service start ${new Date().toISOString()}`);
      // Fetch all buyers from the database
      let sellers = await Seller.find();
  
      if (sellers.length === 0) {
        result.message = ResponseMessage.NODATAFOUND;
      } else {
        result.code = ResponseCode.SUCCESS;
        result.data = sellers;
      }
    } catch (error) {
      // Handle errors if any occur during the database operation
      logger.error(`Error fetching sellers: ${error}`);
      result.message = "Error fetching sellers";
      result.subcode = ResponseSubCode.EXCEPTION;
    }
    logger.info(`Get Sellers in service end ${new Date().toISOString()}`);
    return result;
  };
  



module.exports = { registerSeller,getAllSellers };
