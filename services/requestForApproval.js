const { connect } = require("../utils/DataBase.js");
const { RequestForApproval } = require("../utils/models/RequestForApproval.js");
const ApiResponse = require("../utils/models/ApiResponse.js");
const { Counter } = require("../utils/models/Counter.js");
const {
  ResponseCode,
  ResponseMessage,
  ResponseSubCode,
} = require("../utils/Enums.js");
const logger = require("../utils/logger.js");
const { getSellerId } = require("./sellerService.js");

const getApprovals= async (requestId, user) => {
  let result = new ApiResponse(ResponseCode.FAILURE, 0, "", null);
  try {
    logger.info(`Get approvals in request for approval start ${Date.now()}`);
    let approvals = [];
    // Fetch approval based on the Id
    const approval = await RequestForApproval.findById(requestId);
    if (approval) {
      approvals.push(approval);
    } else if (user.roleId === Roles.BUYER || user.roleId === Roles.ADMIN) {
      // Fetch all approvals if user type is admin or buyer
      approvals = await RequestForApproval.aggregate([
        {
          $lookup: {
            from: "Seller", // Name of the Seller collection
            localField: "sellerId",
            foreignField: "sellerId", // Common attribute name in the Seller collection
            as: "seller",
          },
        },
        {
          $unwind: "$seller", // Unwind the 'seller' array to get a single seller object
        },
        {
          $project: {
            _id: 1,
            name: 1,
            type:1,
            description: 1,
            price: 1,
            "seller.companyName": 1,
            "seller._id":1
          },
        },
      ]);

    } else if (user.roleId === Roles.SELLER) {
      // Fetch all approvals related to specific seller
      approvals = await RequestForApproval.find({ sellerId: user.userId },'_id type name  description price createdAt');
    }
    if (approvals.length === 0) {
      result.message = ResponseMessage.NODATAFOUND;
    } else {
      result.code = ResponseCode.SUCCESS;
      result.data = products;
    }
  } catch (error) {
    // Handle errors if any occur during the database operation
    logger.error(`Error fetching approvals: ${error}`);
    result.message = "Unable to fetch approvals";
    result.subcode = ResponseSubCode.EXCEPTION;
  }
  return result;
};


const saveRequest = async (request, user) => {
  let result = new ApiResponse(ResponseCode.FAILURE, 0, "", null);
  logger.info(`Save request for approval in service start ${Date.now()}`);
  try {
    const { requestId } = request;

    // Check if the request with the given productId exists
    const existingRequest = await RequestForApproval.findOne({ requestId });

    if (existingRequest) {
      // Update the existing request with the fields provided in the request body
      const updatedRequest = await RequestForApproval.findOneAndUpdate(
        { requestId },
        { $set: request },
        { new: true }
      );

      if (updatedRequest) {
        // Request updated successfully
        result.code = ResponseCode.SUCCESS;
        result.message = ResponseMessage.RFAUPDATED;
        result.data = updatedRequest;
      } else {
        // Handle update failure
        result.message = ResponseMessage.RFANOTUPDATED;
      }
    } else {
      // Product does not exist, create a new one
      const counter = await Counter.findOneAndUpdate(
        { name: "requestId" },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
      );
      request.requestId = counter.value;
      request.buyerId = user.userId;
      request.sellerId = await getSellerId(request.sellerUniqueId);

      // Create the new product
      let dbResponse = await RequestForApproval.create(request);

      console.log(dbResponse);
      if (dbResponse._id) {
        result.code = ResponseCode.SUCCESS;
        result.message = ResponseMessage.RFAADDED;
        result.data = dbResponse;
      }
    }
  } catch (error) {
    logger.error(`Error during registration request for approval: ${error}`);
    result.message = "Unable to add or update product";
    result.subcode = ResponseSubCode.EXCEPTION;
  }
  logger.info(`Save request for approval in service end ${Date.now()}`);
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

module.exports = {getApprovals, saveRequest };
