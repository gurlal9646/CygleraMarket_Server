const { connect } = require("../utils/DataBase.js");
const { Product } = require("../utils/models/Product.js");
const ApiResponse = require("../utils/models/ApiResponse.js");
const { Counter } = require("../utils/models/Counter.js");
const { ResponseCode, ResponseMessage, Roles } = require("../utils/Enums.js");
const logger = require("../utils/logger.js");

const getProducts = async (request, response) => {
  let apiResponse = new ApiResponse(ResponseCode.FAILURE, 0, "", null);
  try {
    logger.info(`Get Products enters:`);
    // Fetch all products from the database
    let products = [];
    if (request.user.roleId === Roles.BUYER || request.user.roleId === Roles.ADMIN) {
      products = await Product.find();
    }
    else (request.user.roleId === Roles.SELLER)
    {
      products = await Product.find({ sellerId: request.user.userId });
    }
    if (products.length === 0) {
      apiResponse.message = ResponseMessage.NODATAFOUND;
    }
    else {
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

const deleteProduct = async (request, response) => {
  let apiResponse = new ApiResponse(ResponseCode.FAILURE, 0, "", null);
  try {
    const { productId } = request.params;
    let deletedProduct;
    console.log(request.user);

    if (request.user.roleId === Roles.ADMIN) {
      // For admins, allow deletion of any product
      deletedProduct = await Product.findOneAndDelete({ productId });
    } else if (request.user.roleId === Roles.SELLER) {
      console.log('inside seller del');
      // For sellers, allow deletion of only their own products
      deletedProduct = await Product.findOneAndDelete(
        {
          $and: [
            { productId },
            { sellerId: request.user.userId }
          ]

        });
    }

    if (deletedProduct) {
      // Product deleted successfully
      apiResponse.code = ResponseCode.SUCCESS;
      apiResponse.message = ResponseMessage.PRODUCTDELETED;
      apiResponse.data = deletedProduct;
    } else {
      // Product not found or unauthorized deletion attempt
      apiResponse.message = ResponseMessage.PRODUCTNOTFOUND;
    }
    response.json(apiResponse);
  } catch (error) {
    // Handle errors if any occur during the database operation
    logger.error(`Error deleting product: ${JSON.stringify(error)}`);
    response.status(500).json(
      new ApiResponse(
        ResponseCode.FAILURE,
        0,
        ResponseMessage.PRODUCTNOTDELETED,
        null
      )
    );
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

module.exports = { addProduct, getProducts, deleteProduct };
