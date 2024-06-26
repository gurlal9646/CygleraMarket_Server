const { connect } = require("../utils/DataBase.js");
const { Product } = require("../utils/models/Product.js");
const ApiResponse = require("../utils/models/ApiResponse.js");
const {
  ResponseCode,
  ResponseMessage,
  Roles,
  ResponseSubCode,
} = require("../utils/Enums.js");
const logger = require("../utils/logger.js");
const { v4: uuidv4 } = require("uuid");

const getProducts = async (productId, user) => {
  let result = new ApiResponse(ResponseCode.FAILURE, 0, "", null);
  try {
    logger.info(`Get products in service start ${new Date().toISOString()}`);
    let products = [];
    // Fetch product based on the Id
    const product = await Product.findById(productId);
    if (product) {
      products.push(product);
    } else if (user.roleId === Roles.BUYER || user.roleId === Roles.ADMIN) {
      // Fetch all products if user type is admin or buyer
      products = await Product.aggregate([
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
            productId: 1,
            name: 1,
            description: 1,
            price: 1,
            category: 1,
            manufacturer: 1,
            stockQuantity: 1,
            "seller.companyName": 1,
            "seller.sellerId": 1,
          },
        },
      ]);
    } else if (user.roleId === Roles.SELLER) {
      // Fetch all products related to specific seller
      products = await Product.find(
        { sellerId: user.userId },
        "_id name  description price category manufacturer expiryDate createdAt"
      );
    }
    if (products.length === 0) {
      result.message = ResponseMessage.NODATAFOUND;
    } else {
      result.code = ResponseCode.SUCCESS;
      result.data = products;
    }
  } catch (error) {
    // Handle errors if any occur during the database operation
    logger.error(`Error fetching products: ${error}`);
    result.message = "Unable to fetch products";
    result.subcode = ResponseSubCode.EXCEPTION;
  }
  return result;
};

const saveProduct = async (product, user) => {
  let result = new ApiResponse(ResponseCode.FAILURE, 0, "", null);
  logger.info(`Save product in service start ${new Date().toISOString()}`);
  try {
    const { productId } = product;

    // Check if the product with the given productId exists
    const existingProduct = await Product.findOne({ productId });

    if (existingProduct) {
      // Update the existing product with the fields provided in the request body
      const updatedProduct = await Product.findOneAndUpdate(
        { productId },
        { $set: product },
        { new: true }
      );

      if (updatedProduct) {
        // Product updated successfully
        result.code = ResponseCode.SUCCESS;
        result.message = ResponseMessage.PRODUCTUPDATED;
        result.data = updatedProduct;
      } else {
        // Handle update failure
        result.message = ResponseMessage.PRODUCTNOTUPDATED;
      }
    } else {
      // Product does not exist, create a new one
      product.productId = uuidv4();
      product.sellerId = user.userId;

      // Create the new product
      let dbResponse = await Product.create(product);

      if (dbResponse._id) {
        result.code = ResponseCode.SUCCESS;
        result.message = ResponseMessage.PRODUCTADDED;
        result.data = dbResponse;
      }
    }
  } catch (error) {
    logger.error(`Error during registration product: ${error}`);
    result.message = "Unable to add or update product";
    result.subcode = ResponseSubCode.EXCEPTION;
  }
  logger.info(`Save product in service end ${Date.now()}`);
  return result;
};

const getLatestProducts = async (req, res) => {
  let result = new ApiResponse(ResponseCode.FAILURE, 0, "", null);
  try {
    // Fetch 10 products sorted by date in descending order
    const products = await Product.find().sort({ date: -1 }).limit(10);
    if (products.length > 0) {
      result.code = ResponseCode.SUCCESS;
      result.data = products;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
  return result;
};
const removeProduct = async (productId, user) => {
  let result = new ApiResponse(ResponseCode.FAILURE, 0, "", null);
  try {
    logger.info(`Remove product in service start ${new Date().toISOString()}`);
    let deletedProduct;
    if (user.roleId === Roles.ADMIN) {
      // For admins, allow deletion of any product
      deletedProduct = await Product.findOneAndDelete({ _id: productId });
    } else if (user.roleId === Roles.SELLER) {
      // For sellers, allow deletion of only their own products
      deletedProduct = await Product.findOneAndDelete({
        $and: [{ _id: productId }, { sellerId: user.userId }],
      });
    }

    if (deletedProduct) {
      // Product deleted successfully
      result.code = ResponseCode.SUCCESS;
      result.message = ResponseMessage.PRODUCTDELETED;
      result.data = deletedProduct;
    } else {
      // Product not found or unauthorized deletion attempt
      result.message = ResponseMessage.PRODUCTNOTFOUND;
    }
  } catch (error) {
    // Handle errors if any occur during the database operation
    logger.error(`Error deleting product: ${error}`);
    result.message = "Unable to delete product";
    result.subcode = ResponseSubCode.EXCEPTION;
  }
  logger.info(`Remove product in service end ${Date.now()}`);
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

module.exports = { getProducts, saveProduct, removeProduct, getLatestProducts };
