const { connect } = require("../utils/DataBase.js");
const { Contract } = require("../utils/models/Contract.js");
const ApiResponse = require("../utils/models/ApiResponse.js");
const {
  ResponseCode,
  ResponseMessage,
  Roles,
  ResponseSubCode,
} = require("../utils/Enums.js");
const logger = require("../utils/logger.js");
const { v4: uuidv4 } = require('uuid');



const getContracts = async (contractId, user) => {
  let result = new ApiResponse(ResponseCode.FAILURE, 0, "", null);
  try {
    logger.info(`Get contract in service start ${new Date().toISOString()}`);
    let contracts = [];
    // Fetch contract based on the Id
    const contract = await Contract.findById(contractId);
    if (contract) {
      contracts.push(contract);
    } else if (user.roleId === Roles.BUYER || user.roleId === Roles.ADMIN) {
      // Fetch all Contracts if user type is admin or buyer
       contracts = await Contract.find();
    } else if (user.roleId === Roles.SELLER) {
      // Fetch all Contracts related to specific seller
     contracts = await Contract.find({ sellerId: user.userId });
    }
    if (contracts.length === 0) {
      result.message = ResponseMessage.NODATAFOUND;
    } else {
      result.code = ResponseCode.SUCCESS;
      result.data = contracts;
    }
  } catch (error) {
    // Handle errors if any occur during the database operation
    logger.error(`Error fetching contracts: ${error}`);
    result.message = "Unable to fetch contracts";
    result.subcode = ResponseSubCode.EXCEPTION;
  }
  return result;
};

const saveContract = async (contract, user) => {
  let result = new ApiResponse(ResponseCode.FAILURE, 0, "", null);
  logger.info(`Save contract in service start ${Date.now()}`);
  try {
    const { contractId } = contract;

    // Check if the Contracts with the given ContractId exists
    const existingContract = await Contract.findOne({ contractId });

    if (existingContract) {
      // Update the existing Contract with the fields provided in the request body
      const updatedContract = await Contract.findOneAndUpdate(
        { contractId },
        { $set: contract },
        { new: true }
      );

      if (updatedContract) {
        // Contract updated successfully
        result.code = ResponseCode.SUCCESS;
        result.message = ResponseMessage.CONTRACTUPDATED;
        result.data = updatedProgram;
      } else {
        // Handle update failure
        result.message = ResponseMessage.CONTRACTNOTUPDATED;
      }
    } else {
      // Contract does not exist, create a new one
      contract.contractId = uuidv4();
      contract.sellerId = user.userId;

      // Create the new Contract
      let dbResponse = await Contract.create(contract);

      if (dbResponse._id) {
        result.code = ResponseCode.SUCCESS;
        result.message = ResponseMessage.CONTRACTADDED;
        result.data = dbResponse;
      }
    }
  } catch (error) {
    logger.error(`Error during registration contract: ${error}`);
    result.message = "Unable to add or update contract";
    result.subcode = ResponseSubCode.EXCEPTION;
  }
  logger.info(`Save contract in service end ${Date.now()}`);
  return result;
};

const removeContract = async (contractId, user) => {
  let result = new ApiResponse(ResponseCode.FAILURE, 0, "", null);
  try {
    logger.info(`Remove contract in service start ${new Date().toISOString()}`);
    let deletedContract;
    if (user.roleId === Roles.ADMIN) {
      // For admins, allow deletion of any Contract
      deletedContract = await Contract.findOneAndDelete({ _id: contractId });
    } else if (user.roleId === Roles.SELLER) {
      // For sellers, allow deletion of only their own Contract
      deletedContract = await Contract.findOneAndDelete({
        $and: [{ _id: contractId }, { sellerId: user.userId }],
      });
    }

    if (deletedContract) {
      // Contract deleted successfully
      result.code = ResponseCode.SUCCESS;
      result.message = ResponseMessage.CONTRACTDELETED;
      result.data = deletedContract;
    } else {
      // Contract not found or unauthorized deletion attempt
      result.message = ResponseMessage.CONTRACTNOTFOUND;
    }
  } catch (error) {
    // Handle errors if any occur during the database operation
    logger.error(`Error deleting contract : ${error}`);
    result.message = "Unable to delete contract";
    result.subcode = ResponseSubCode.EXCEPTION;
  }
  logger.info(`Remove contract in service end ${Date.now()}`);
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

module.exports = { getContracts, saveContract, removeContract };
