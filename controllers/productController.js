const {
  getProducts,
  saveProduct,
  removeProduct,
} = require("../services/productService.js");
const logger = require("../utils/logger.js");

const products = async (request, response) => {
  logger.info(`Get Products: ${JSON.stringify(request.body)}`);
  const result = await getProducts(request.params.productId, request.user);
  response.json(result);
};

const addProduct = async function (request, response) {
  logger.info(`Add Product: ${JSON.stringify(request.body)}`);
  const result = await saveProduct(request.body, request.user);
  response.json(result);
};

const deleteProduct = async (request, response) => {
  logger.info(`Delete Product ProductId: ${request.params.productId}`);
  const result = await removeProduct(request.params.productId, request.user);
  response.json(result);
};

module.exports = { addProduct, products, deleteProduct };
