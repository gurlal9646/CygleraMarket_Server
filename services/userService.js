const { Seller } = require("../utils/models/SellerInfo.js");
const { Buyer } = require("../utils/models/BuyerInfo.js");
const ApiResponse = require("../utils/models/ApiResponse.js");

const { ResponseCode, Roles, ResponseMessage } = require("../utils/Enums.js");
const { AccessInfo } = require("../utils/models/AccessInfo.js");
const { comparePasswords, encryptPassword } = require("../utils/bcrypt.js");

// Fetch user details by roleId and userId
async function getUserDetails(roleId, userId) {
  const result = new ApiResponse(ResponseCode.FAILURE, 0, "", null);
  try {
    if (!roleId || (!userId && roleId == Roles.ADMIN)) {
      result.message = "Role ID and User ID are required";
      return result;
    }

    let userInfo;
    switch (parseInt(roleId)) {
      case Roles.SELLER:
        userInfo = await Seller.findOne({ sellerId: userId });
        break;
      case Roles.BUYER:
        userInfo = await Buyer.findOne({ buyerId: userId });
        break;
      case Roles.ADMIN:
        //admin
        break;
      default:
        break;
    }
    result.code = ResponseCode.SUCCESS;
    result.message = "User details Found";
    result.data = userInfo;
    return result;
  } catch (err) {
    result.message = "Error fetching user details";
    return result;
  }
}

// Update user details by roleId and userId
async function updateUserDetails(roleId, userId, newDetails) {
  const result = new ApiResponse(ResponseCode.FAILURE, 0, "", null);
  try {
    switch (parseInt(roleId)) {
      case Roles.SELLER:
        await Seller.findOneAndUpdate({ sellerId: userId }, newDetails, {
          new: true,
        });
        await AccessInfo.findOneAndUpdate({ sellerId: userId }, newDetails, {
          new: true,
        });
        break;
      case Roles.BUYER:
        await Buyer.findOneAndUpdate({ buyerId: userId }, newDetails, {
          new: true,
        });
        await AccessInfo.findOneAndUpdate({ buyerId: userId }, newDetails, {
          new: true,
        });
        break;
      // Add other role cases if needed
      default:
        break;
    }
    result.code = ResponseCode.SUCCESS;
    result.message = "User details Updated";
  } catch (err) {
    throw new Error("Error updating user details");
  }
  return result;
}

async function changePassword(user, request) {
  const result = new ApiResponse(ResponseCode.FAILURE, 0, "", null);
  try {
    let { currentPassword, password } = request;
    let accessInfo;

    switch (parseInt(user.roleId)) {
      case Roles.SELLER:
        accessInfo = await AccessInfo.findOne({ sellerId: user.userId });
        break;
      case Roles.BUYER:
        accessInfo = await AccessInfo.findOne({ buyerId: user.userId });
        break;
      default:
        break;
    }

    if (!(await comparePasswords(currentPassword, accessInfo.password))) {
      result.message = ResponseMessage.CURRENTPASSWORDNOTMATCH;
    } else {
      console.log("inside update password");
      password = await encryptPassword(password);
      await AccessInfo.findOneAndUpdate(
        { _id: accessInfo._id },
        { $set: { password: password } }, // Specify the field and its new value here
        { new: true }
      );

      result.code = ResponseCode.SUCCESS;
      result.message = ResponseMessage.PASSWORDUPDATED;
    }
  } catch (err) {
    console.log(err);
    throw new Error("Error updating user password");
  }
  return result;
}

async function deleteAccount(user) {
  const result = new ApiResponse(ResponseCode.FAILURE, 0, "", null);
  try {

    console.log(user.roleId);
    if (parseInt(user.roleId) === Roles.SELLER) {
      await AccessInfo.findOneAndUpdate(
        { sellerId: user.userId },
        { $set: { status: 2 } }, // Specify the field and its new value here
        { new: true }
      );
      await Seller.findOneAndUpdate(
        { sellerId: user.userId },
        { $set: { status: 2 } }, // Specify the field and its new value here
        { new: true }
      );
    } else if (parseInt(user.roleId) === Roles.BUYER) {
      await AccessInfo.findOneAndUpdate(
        { buyerId: user.userId },
        { $set: { status: 2 } }, // Specify the field and its new value here
        { new: true }
      );
      await Buyer.findOneAndUpdate(
        { buyerId: user.userId },
        { $set: { status: 2 } }, // Specify the field and its new value here
        { new: true }
      );
    }
    
    result.code = ResponseCode.SUCCESS;
    result.message = "Account deleted successfully!";
  } catch (err) {
    console.log(err);
    throw new Error("Error deleting account");
  }
  return result;
}

module.exports = { getUserDetails, updateUserDetails, changePassword ,deleteAccount};
