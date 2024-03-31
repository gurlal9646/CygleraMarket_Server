const { connect } = require("../utils/DataBase.js");
const { RequestForApproval } = require("../utils/models/RequestForApproval.js");
const {
  RequestConversation,
} = require("../utils/models/RequestConversation.js");

const ApiResponse = require("../utils/models/ApiResponse.js");
const {
  ResponseCode,
  ResponseMessage,
  ResponseSubCode,
  Roles,
} = require("../utils/Enums.js");
const logger = require("../utils/logger.js");
const { getSellerId } = require("./sellerService.js");
const { v4: uuidv4 } = require("uuid");

const { saveContract } = require("../services/contractService.js");

const getApprovals = async (requestId, user) => {
  let result = new ApiResponse(ResponseCode.FAILURE, 0, "", null);
  try {
    logger.info(
      `Get approvals in request for approval start ${new Date().toISOString()}`
    );
    let approvals = [];
    if (requestId) {
      approvals = await RequestForApproval.find({ requestId: requestId });
    } else if (user.roleId === Roles.BUYER) {
      approvals = await RequestForApproval.find(
        { buyerId: user.userId },
        {
          _id: 0,
          requestId: 1,
          type: 1,
          name: 1,
          description: 1,
          price: 1,
          status: 1,
          quantity: 1,
          startDate: 1,
          endDate: 1,
          createdAt: 1,
        }
      ).sort({ createdAt: -1 });
    } else if (user.roleId === Roles.SELLER) {
      // Fetch all approvals related to specific seller
      approvals = await RequestForApproval.find(
        { sellerId: user.userId },
        {
          _id: 0,
          requestId: 1,
          type: 1,
          name: 1,
          description: 1,
          price: 1,
          status: 1,
          quantity: 1,
          startDate: 1,
          endDate: 1,
          createdAt: 1,
        }
      ).sort({ createdAt: -1 });
    } else if (user.roleId === Roles.ADMIN) {
      // Fetch all approvals related to specific seller
      approvals = await RequestForApproval.find({
        _id: 0,
        requestId: 1,
        type: 1,
        name: 1,
        description: 1,
        price: 1,
        status: 1,
        quantity: 1,
        startDate: 1,
        endDate: 1,
        createdAt: 1,
      }).sort({ createdAt: -1 });
    }
    if (approvals.length === 0) {
      result.message = ResponseMessage.NODATAFOUND;
    } else {
      result.code = ResponseCode.SUCCESS;
      result.data = approvals;
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
  logger.info(
    `Save request for approval in service start ${new Date().toISOString()}`
  );
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
      // Purchase Request does not exist, create a new one
      request.requestId = uuidv4();
      request.buyerId = user.userId;
      request.sellerId = request.sellerUniqueId;

      // Create the purchase request
      let dbResponse = await RequestForApproval.create(request);
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
  logger.info(
    `Save request for approval in service end ${new Date().toISOString()}`
  );
  return result;
};

const updateRequestStatus = async (requestId, request) => {
  let result = new ApiResponse(ResponseCode.FAILURE, 0, "", null);
  logger.info(
    `Update request status for purchase in service start ${new Date().toISOString()}`
  );
  try {
    // Check if the request with the given requestId exists
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
 
        console.log(updatedRequest);
        if (updatedRequest.status === "approved") {
          const contract = {
           type: updatedRequest.type,
           itemId:updatedRequest.itemId,
           sellerId:updatedRequest.sellerId,
           buyerId:updatedRequest.buyerId,
           price:updatedRequest.price

          };
          saveContract(contract, request.user);
        }

        result.code = ResponseCode.SUCCESS;
        result.message = ResponseMessage.REQUESTSTATUSUPDATED;
        result.data = updatedRequest;
      } else {
        // Handle update failure
        result.message = ResponseMessage.REQUESTSTATUSNOTUPDATED;
      }
    }
  } catch (error) {
    logger.error(`Error during updating request for purchase: ${error}`);
    result.message = "Unable to add or update product";
    result.subcode = ResponseSubCode.EXCEPTION;
  }
  logger.info(
    `Update request status for purchase in service end ${new Date().toISOString()}`
  );
  return result;
};

const getPurchaseRequestCount = async (user) => {
  let result = new ApiResponse(ResponseCode.FAILURE, 0, "", null);
  try {
    logger.info(`Get purchase request count start ${new Date().toISOString()}`);
    let requestCount = {
      total: 0,
      approved: 0,
      rejected: 0,
      pending: 0,
    };
    if (user.roleId === Roles.BUYER) {
      let allRequests = await RequestForApproval.find({ buyerId: user.userId });

      // Assign total count
      requestCount.total = allRequests.length;

      // Count requests with different statuses
      allRequests.forEach((request) => {
        switch (request.status) {
          case "approved":
            requestCount.approved++;
            break;
          case "rejected":
            requestCount.rejected++;
            break;
          case "pending":
            requestCount.pending++;
            break;
          default:
            break;
        }
      });
    } else if (user.roleId === Roles.SELLER) {
      let allRequests = await RequestForApproval.find({
        sellerId: user.userId,
      });

      // Assign total count
      requestCount.total = allRequests.length;

      // Count requests with different statuses
      allRequests.forEach((request) => {
        switch (request.status) {
          case "approved":
            requestCount.approved++;
            break;
          case "rejected":
            requestCount.rejected++;
            break;
          case "pending":
            requestCount.pending++;
            break;
          default:
            break;
        }
      });
    } else if (user.roleId === Roles.ADMIN) {
      let allRequests = await RequestForApproval.find();

      // Assign total count
      requestCount.total = allRequests.length;

      // Count requests with different statuses
      allRequests.forEach((request) => {
        switch (request.status) {
          case "approved":
            requestCount.approved++;
            break;
          case "rejected":
            requestCount.rejected++;
            break;
          case "pending":
            requestCount.pending++;
            break;
          default:
            break;
        }
      });
    }

    result.code = ResponseCode.SUCCESS;
    result.data = requestCount;
  } catch (error) {
    // Handle errors if any occur during the database operation
    logger.error(`Error fetching approvals: ${error}`);
    result.message = "Unable to fetch approvals";
    result.subcode = ResponseSubCode.EXCEPTION;
  }
  return result;
};

const addConversation = async (request) => {
  let result = new ApiResponse(ResponseCode.FAILURE, 0, "", null);
  try {
    logger.info(
      `Add conversation in service start ${new Date().toISOString()}`
    );
    request.conversationId = uuidv4();

    let dbResponse = await RequestConversation.create(request);
    if (dbResponse._id) {
      result.code = ResponseCode.SUCCESS;
      result.data = dbResponse;
    }
  } catch (error) {
    // Handle errors if any occur during the database operation
    logger.error(`Error adding conversation: ${error}`);
    result.message = "Unable to add conversation";
    result.subcode = ResponseSubCode.EXCEPTION;
  }
  logger.info(`Add conversation in service end ${new Date().toISOString()}`);
  return result;
};

const getConversation = async (requestId) => {
  let result = new ApiResponse(ResponseCode.FAILURE, 0, "", null);
  try {
    logger.info(`Get all conversation ${new Date().toISOString()}`);
    let conversation = [];
    // Get conversation based on the requestId
    if (requestId) {
      conversation = await RequestConversation.find({
        requestId: requestId,
      }).sort({ createdAt: 1 });
    }

    if (conversation.length === 0) {
      result.message = ResponseMessage.NODATAFOUND;
    } else {
      result.code = ResponseCode.SUCCESS;
      result.data = conversation;
    }
  } catch (error) {
    // Handle errors if any occur during the database operation
    logger.error(`Error fetching conversation: ${error}`);
    result.message = "Unable to fetch conversation";
    result.subcode = ResponseSubCode.EXCEPTION;
  }
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

module.exports = {
  getApprovals,
  saveRequest,
  addConversation,
  getConversation,
  updateRequestStatus,
  getPurchaseRequestCount,
};
