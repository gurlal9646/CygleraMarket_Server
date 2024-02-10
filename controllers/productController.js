const { connect } = require("../utils/DataBase.js");
const { encryptPassword } = require("../utils/bcrypt.js");
const { Product } = require("../utils/models/Product.js");
const ApiResponse = require("../utils/models/ApiResponse.js"); // Importing ApiResponse from the apiResponse.js file
const { Counter } = require("../utils/models/Counter.js");
const { ResponseCode, ResponseMessage, Roles } = require("../utils/Enums.js");
const { AccessInfo } = require("../utils/models/AccessInfo.js");
const logger = require("../utils/logger.js");

const addProduct = async function (request, response) {
  logger.info(`Add Product: ${JSON.stringify(request.body)}`);

  try {
    const { productId } = request.body;

    // Check if the product with the given productId exists
    const existingProduct = await Product.findOne({ productId });

    if (existingProduct) {
      // Update the existing product with the fields provided in the request body
      const updatedProduct = await Product.findOneAndUpdate(
        { productId },
        { $set: request.body },
        { new: true }
      );

      if (updatedProduct) {
        // Product updated successfully
        const result = new ApiResponse(
          ResponseCode.SUCCESS,
          0,
          ResponseMessage.PRODUCTUPDATED,
          updatedProduct
        );
        response.json(result);
      } else {
        // Handle update failure
        const result = new ApiResponse(
          ResponseCode.FAILURE,
          0,
          ResponseMessage.PRODUCTNOTUPDATED,
          null
        );
        response.json(result);
      }
    } else {
      // Product does not exist, create a new one
      const counter = await Counter.findOneAndUpdate(
        { name: "productId" },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
      );
      request.body.productId = counter.value;
      request.body.sellerId = request.user.userId;

      // Create the new product
      let dbResponse = await Product.create(request.body);

      if (dbResponse._id) {
        const result = new ApiResponse(
          ResponseCode.SUCCESS,
          0,
          ResponseMessage.PRODUCTADDED,
          dbResponse
        );
        response.json(result);
      }
    }
  } catch (error) {
    logger.error(`Error during registration product: ${JSON.stringify(error)}`);
    response
      .status(500)
      .json(
        new ApiResponse(
          ResponseCode.FAILURE,
          0,
          ResponseMessage.PRODUCTNOTADDED,
          null
        )
      );
  }
};

const products = async (request, response) => {
    let apiResponse= new ApiResponse(ResponseCode.FAILURE, 0,"",null);
  try {
    logger.info(`Get Products enters:`);
    // Fetch all products from the database
    let products = [];
    if(request.user.roleId  === Roles.BUYER || request.user.roleId  === Roles.ADMIN){
         products = await Product.find();
    }
    else(request.user.roleId  === Roles.SELLER)
    {
        products = await Product.find({sellerId:request.user.userId});
    }
    if(products.length === 0) {
        apiResponse.message = ResponseMessage.NODATAFOUND;
    }
    else{
        apiResponse.code = ResponseCode.SUCCESS;
        apiResponse.data = products;
    }
    const result = new ApiResponse(
        ResponseCode.SUCCESS,
        0,
        '',
        products
      );
      response.json(result);
  } catch (error) {
    // Handle errors if any occur during the database operation
    logger.error(`Error fetching products: ${JSON.stringify(error)}`);
    response.status(500).json(apiResponse);
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

module.exports = { addProduct,products };
