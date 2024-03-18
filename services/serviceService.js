const { connect } = require("../utils/DataBase.js");
const { Service } = require("../utils/models/Service.js");
const ApiResponse = require("../utils/models/ApiResponse.js");
const {
  ResponseCode,
  ResponseMessage,
  Roles,
  ResponseSubCode,
} = require("../utils/Enums.js");
const logger = require("../utils/logger.js");
const { v4: uuidv4 } = require('uuid');



const getServices = async (serviceId, user) => {
  let result = new ApiResponse(ResponseCode.FAILURE, 0, "", null);
  try {
    logger.info(`Get services in service start ${new Date().toISOString()}`);
    let services = [];
    // Fetch service based on the Id
    const service = await Service.findById(serviceId);
    if (service) {
      services.push(service);
    } else if (user.roleId === Roles.BUYER || user.roleId === Roles.ADMIN) {
      // Fetch all services if user type is admin or buyer
      services = await Service.aggregate([
        {
          $lookup: {
            from: "Service", // Name of the Seller collection
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
            serviceId: 1,
            name: 1,
            description: 1,
            price: 1,
            "seller.companyName": 1,
            "seller.sellerId":1
          },
        },
      ]);
    } else if (user.roleId === Roles.SELLER) {
      // Fetch all services related to specific seller
      services = await Service.find({ sellerId: user.userId },'_id name  description price createdAt');
    }
    if (services.length === 0) {
      result.message = ResponseMessage.NODATAFOUND;
    } else {
      result.code = ResponseCode.SUCCESS;
      result.data = services;
    }
  } catch (error) {
    // Handle errors if any occur during the database operation
    logger.error(`Error fetching services: ${error}`);
    result.message = "Unable to fetch services";
    result.subcode = ResponseSubCode.EXCEPTION;
  }
  return result;
};

const saveService = async (service, user) => {
  let result = new ApiResponse(ResponseCode.FAILURE, 0, "", null);
  logger.info(`Save service in service start ${new Date().toISOString()}`);
  try {
    const {  serviceId } = service;

    // Check if the service with the given serviceId exists
    const existingService = await Service.findOne({ serviceId });

    if (existingService) {
      // Update the existing service with the fields provided in the request body
      const updatedService = await Service.findOneAndUpdate(
        { serviceId },
        { $set: service },
        { new: true }
      );

      if (updatedService) {
        // Product updated successfully
        result.code = ResponseCode.SUCCESS;
        result.message = ResponseMessage.SERVICEUPDATED;
        result.data = updatedService;
      } else {
        // Handle update failure
        result.message = ResponseMessage.SERVICENOTUPDATED;
      }
    } else {
      // Service does not exist, create a new one

      service.serviceId = uuidv4();
      service.sellerId = user.userId;

      // Create the new service
      let dbResponse = await Service.create(service);

      if (dbResponse._id) {
        result.code = ResponseCode.SUCCESS;
        result.message = ResponseMessage.SERVICEADDED;
        result.data = dbResponse;
      }
    }
  } catch (error) {
    logger.error(`Error during registration service: ${error}`);
    result.message = "Unable to add or update service";
    result.subcode = ResponseSubCode.EXCEPTION;
  }
  logger.info(`Save service in service end ${new Date().toISOString()}`);
  return result;
};

const removeService = async (serviceId, user) => {
  let result = new ApiResponse(ResponseCode.FAILURE, 0, "", null);
  try {
    logger.info(`Remove service in service start ${new Date().toISOString()}`);
    let deletedService;
    if (user.roleId === Roles.ADMIN) {
      // For admins, allow deletion of any service
      deletedService = await Product.findOneAndDelete({ _id: serviceId });
    } else if (user.roleId === Roles.SELLER) {
      // For sellers, allow deletion of only their own services
      deletedService = await Service.findOneAndDelete({
        $and: [{ _id: serviceId }, { sellerId: user.userId }],
      });
    }

    if (deletedService) {
      //  Service deleted successfully
      result.code = ResponseCode.SUCCESS;
      result.message = ResponseMessage.SERVICEDELETED;
      result.data = deletedService;
    } else {
      //  Service not found or unauthorized deletion attempt
      result.message = ResponseMessage.SERVICENOTFOUND;
    }
  } catch (error) {
    // Handle errors if any occur during the database operation
    logger.error(`Error deleting service: ${error}`);
    result.message = "Unable to delete service";
    result.subcode = ResponseSubCode.EXCEPTION;
  }
  logger.info(`Remove  service in service end ${new Date().toISOString()}`);
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

module.exports = { getServices, saveService, removeService };
