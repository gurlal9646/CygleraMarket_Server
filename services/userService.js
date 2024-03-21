const { Seller } = require("../utils/models/SellerInfo.js");
const { Buyer } = require("../utils/models/BuyerInfo.js");
const ApiResponse = require("../utils/models/ApiResponse.js");

const {
    ResponseCode,
    ResponseSubCode,
    ResponseMessage,
    Roles,
  } = require("../utils/Enums.js");

// Fetch user details by roleId and userId
async function getUserDetails(roleId, userId) {
    const result = new ApiResponse(ResponseCode.FAILURE, 0, "", null);
   console.log(roleId,userId);
   
    try {
        if (!roleId || !userId && roleId==Roles.ADMIN ) {
            result.message = 'Role ID and User ID are required';
            return result;
        }
       
        let userInfo;
        switch (parseInt(roleId)) {
            case Roles.SELLER:
                
                userInfo = await Seller.findOne({ sellerId: userId });
                break;
            case Roles.BUYER:
                userInfo = await Buyer.findOne({ buyerId: userId});
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
        console.log(result);
        return result;
    } catch (err) {
        result.message = 'Error fetching user details';
        return result;
    }
}


// Update user details by roleId and userId
async function updateUserDetails(roleId, userId, newDetails) {
    const result = new ApiResponse(ResponseCode.FAILURE, 0, "", null);
    try {
        switch (parseInt(roleId)) {
            case Roles.SELLER:
                userInfo = await Seller.findOneAndUpdate({ sellerId: userId }, newDetails, { new: true });
                break;
            case Roles.BUYER:
                userInfo = await Buyer.findOneAndUpdate({ sellerId: userId }, newDetails, { new: true });
                break;
            // Add other role cases if needed
            default:
                break;
        }
        result.code = ResponseCode.SUCCESS;
        result.message = "User details Updated";
        result.data = userInfo;
        console.log(result);
        return result;
    } catch (err) {
        throw new Error('Error updating user details');
    }
}

module.exports = { getUserDetails,updateUserDetails };
