const { connect } = require("../utils/DataBase.js");
const { Program } = require("../utils/models/Program.js");
const ApiResponse = require("../utils/models/ApiResponse.js");
const {
  ResponseCode,
  ResponseMessage,
  Roles,
  ResponseSubCode,
} = require("../utils/Enums.js");
const logger = require("../utils/logger.js");
const { v4: uuidv4 } = require('uuid');




const getPrograms = async (programId, user) => {
  let result = new ApiResponse(ResponseCode.FAILURE, 0, "", null);
  try {
    logger.info(`Get program in service start ${Date.now()}`);
    let programs = [];

    // Fetch Program based on the Id
    if(programId){
      programs = await Program.find({programId:programId});

    }else{
      if (user.roleId === Roles.BUYER || user.roleId === Roles.ADMIN) {
        // Fetch all Programs if user type is admin or buyer

        programs = await Program.aggregate([
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
              programId: 1,
              name: 1,
              description: 1,
              price: 1,
              startDate:1,
              endDate:1,
              "seller.companyName": 1,
              "seller.sellerId":1
            },
          },
        ]);

      } else if (user.roleId === Roles.SELLER) {
        // Fetch all Programs related to specific seller
        programs = await Program.find({ sellerId: user.userId });
      }
    }

    if (programs.length === 0) {
      result.message = ResponseMessage.NODATAFOUND;
    } else {
      result.code = ResponseCode.SUCCESS;
      result.data = programs;
    }
  } catch (error) {
    // Handle errors if any occur during the database operation
    logger.error(`Error fetching programs: ${error}`);
    result.message = "Unable to fetch programs";
    result.subcode = ResponseSubCode.EXCEPTION;
  }
  return result;
};

const saveProgram = async (program, user) => {
  let result = new ApiResponse(ResponseCode.FAILURE, 0, "", null);
  logger.info(`Save program in service start ${new Date().toISOString()}`);
  try {
    const { programId } = program;

    // Check if the Program with the given ProgramId exists
    const existingProgram = await Program.findOne({ programId });

    if (existingProgram) {
      // Update the existing Program with the fields provided in the request body
      const updatedProgram = await Program.findOneAndUpdate(
        { programId },
        { $set: program },
        { new: true }
      );

      if (updatedProgram) {
        // Program updated successfully
        result.code = ResponseCode.SUCCESS;
        result.message = ResponseMessage.PRODUCTUPDATED;
        result.data = updatedProgram;
      } else {
        // Handle update failure
        result.message = ResponseMessage.PROGRAMNOTUPDATED;
      }
    } else {
      // Program does not exist, create a new one
      program.programId = uuidv4();
      program.sellerId = user.userId;

      // Create the new Program
      let dbResponse = await Program.create(program);

      if (dbResponse._id) {
        result.code = ResponseCode.SUCCESS;
        result.message = ResponseMessage.PROGRAMADDED;
        result.data = dbResponse;
      }
    }
  } catch (error) {
    logger.error(`Error during registration product: ${error}`);
    result.message = "Unable to add or update product";
    result.subcode = ResponseSubCode.EXCEPTION;
  }
  logger.info(`Save program in service end ${new Date().toISOString()}`);
  return result;
};

const removeProgram = async (programId, user) => {
  let result = new ApiResponse(ResponseCode.FAILURE, 0, "", null);
  try {
    logger.info(`Remove program in service start ${new Date().toISOString()}`);
    let deletedProgram;
    if (user.roleId === Roles.ADMIN) {
      // For admins, allow deletion of any Program
      deletedProgram = await Program.findOneAndDelete({ _id: programId });
    } else if (user.roleId === Roles.SELLER) {
      // For sellers, allow deletion of only their own Programs
      deletedProgram = await Program.findOneAndDelete({
        $and: [{ _id: programId }, { sellerId: user.userId }],
      });
    }

    if (deletedProgram) {
      // Program deleted successfully
      result.code = ResponseCode.SUCCESS;
      result.message = ResponseMessage.PROGRAMDELETED;
      result.data = deletedProgram;
    } else {
      // Program not found or unauthorized deletion attempt
      result.message = ResponseMessage.PROGRAMNOTFOUND;
    }
  } catch (error) {
    // Handle errors if any occur during the database operation
    logger.error(`Error deleting program: ${error}`);
    result.message = "Unable to delete program";
    result.subcode = ResponseSubCode.EXCEPTION;
  }
  logger.info(`Remove program in service end ${new Date().toISOString()}`);
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

module.exports = { getPrograms, saveProgram, removeProgram };
