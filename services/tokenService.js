const { connect } = require("../utils/DataBase.js");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Joi = require("joi");
const { AccessInfo } = require("../utils/models/AccessInfo.js");
const { Seller } = require("../utils/models/SellerInfo.js");
const { Buyer } = require("../utils/models/BuyerInfo.js");
const { comparePasswords } = require("../utils/bcrypt.js");
const { encryptPassword } = require("../utils/bcrypt.js");
const { sendEmail } = require("../utils/sendEmail.js");
const otpGenerator = require("otp-generator");
const { OTP } = require("../utils/models/OtpSchema.js");

const Token = require("../utils/models/Token.js");

const {
  ResponseCode,
  ResponseSubCode,
  ResponseMessage,
  Roles,
} = require("../utils/Enums.js");

const {
  EmailTemplateType,
  getEmailTemplate,
} = require("../utils/EmailTemplates.js");
const ApiResponse = require("../utils/models/ApiResponse.js");
const logger = require("../utils/logger.js");

const generateToken = async ({ email, password, roleId }) => {
  let accessInfo;
  let result = new ApiResponse(ResponseCode.FAILURE, 0, "", null);

  try {
    logger.info(
      `GenerateToken in service: ${JSON.stringify({ email, password, roleId })}`
    );

    if (
      !(await AccessInfo.findOne({ email: { $regex: email, $options: "i" } }))
    ) {
      result.subcode = ResponseSubCode.USERNOTEXISTS;
      result.message = ResponseMessage.NONEXISTINGUSERMESSAGE;
      return result;
    } else {
      if (!roleId || roleId <= 0) {
        accessInfo = await AccessInfo.find({
          email: { $regex: email, $options: "i" },
        });
        if (accessInfo.length > 1) {
          result.subcode = ResponseSubCode.MULTIPLEACCOUNT;
          result.message = ResponseMessage.MULTIPLEACCOUNT;
          return result;
        } else {
          accessInfo = accessInfo[0];
        }
      } else {
        accessInfo = await AccessInfo.findOne({
          email: { $regex: email, $options: "i" },
          roleId,
        });
      }
      if (await comparePasswords(password, accessInfo.password)) {
        let userInfo;
        let userId;
        switch (accessInfo.roleId) {
          case Roles.SELLER:
            userInfo = await Seller.findOne({ sellerId: accessInfo.sellerId });
            userId = userInfo.sellerId;
            break;
          case Roles.BUYER:
            userInfo = await Buyer.findOne({ buyerId: accessInfo.buyerId });
            userId = userInfo.buyerId;
            break;
          // Add other role cases if needed
          default:
            break;
        }
        const token = jwt.sign(
          {
            userId: userId,
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
          uniqueId: userId,
        };

        await sendOtp(result.data.email);
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
};

const sendOtp = async (email) => {
  let otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  let result = await OTP.findOne({ otp: otp });
  while (result) {
    otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
    });
    result = await OTP.findOne({ otp: otp });
  }
  const otpPayload = { email, otp };
  const otpBody = await OTP.create(otpPayload);
  if (otpBody._id) {
    logger.info(`OTP ${otpBody.otp} generated for User ${email} in token service`);
  }
  const template = getEmailTemplate(EmailTemplateType.OTP);

  if (template) {
    let emailTemplate = '';
    emailTemplate = template.content.replace("$otp", otp);
    await sendEmail(email, template.subject, emailTemplate);
  }
};

const verifyOtp = async (email, otp) => {
  const result = new ApiResponse(ResponseCode.FAILURE, 0, "", null);
  const response = await OTP.find({ email: { $regex: email, $options: "i" } })
    .sort({ createdAt: -1 })
    .limit(1);
  if (response.length === 0 || otp !== response[0].otp) {
    result.message = ResponseMessage.INVALID_OTP_MESSAGE;
  } else {
    result.code = ResponseCode.SUCCESS;
    result.message = ResponseMessage.INVALID_OTP_MESSAGE;
  }
  return result;
};

const resetPasswordLink = async ({ email }) => {
  const result = new ApiResponse(ResponseCode.FAILURE, 0, "", null);

  try {
    const user = await AccessInfo.findOne({
      email: { $regex: email, $options: "i" },
    });
    if (!user) {
      result.subcode = ResponseSubCode.USERNOTEXISTS;
      result.message = "User with given email doesn't exist";
      return result;
    }

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const link = `${process.env.REMOTE}/login/resetpassword/${user._id}/${token.token}`;

    const template = getEmailTemplate(EmailTemplateType.RESET_PASSWORD);

    if (template) {
      template.content = template.content.replace("$link", link);
      await sendEmail(user.email, template.subject, template.content);
    }

    result.code = ResponseCode.SUCCESS;
    result.message = "Password reset link sent successfully";
    return result;
  } catch (error) {
    console.error(`Error occurred in resetPassword: ${error}`);
    result.subcode = 100; // You may update this subcode as per your error handling
    return result;
  }
};

const resetPassword = async ({ pass, userId, token }) => {
  const result = new ApiResponse(ResponseCode.FAILURE, 0, "", null);
  try {
    const schema = Joi.object({ password: Joi.string().required() });
    const { error } = schema.validate(pass);
    if (error) {
      result.message = error.details[0].message;
      return result;
    }

    const user = await AccessInfo.findById(userId);
    if (!user) {
      result.message = "Invalid link or expired(User Not Found)";
      return result;
    }
    const userToken = await Token.findOne({
      userId: user._id,
      token: token,
    });
    if (!userToken) {
      result.message = "Invalid link or expired";
      return result;
    }
    const encryptedPassword = await encryptPassword(pass.password);

    user.password = encryptedPassword; // Assign the hashed password from pass object
    await user.save();
    await userToken.deleteOne();

    result.code = ResponseCode.SUCCESS;
    result.message = "Password reset successfully.";
    return result;
  } catch (error) {
    console.error(`An error occurred in resetPassword: ${error}`);
    result.message = "An error occurred";
    return result;
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

module.exports = { generateToken, resetPasswordLink, resetPassword, verifyOtp };
