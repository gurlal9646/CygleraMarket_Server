const { registerSeller, getAllSellers } = require("../services/sellerService.js");
const logger = require("../utils/logger.js");

const sellerRegister = async function (request, response) {
  logger.info(`Register Seller in controller: ${JSON.stringify(request.body)}`);
  const result = await registerSeller(request.body);
  response.json(result);
};

const getSellers = async function (request, response) {
  logger.info(`GetSellers in controller: ${JSON.stringify(request.body)}`);
  const result = await getAllSellers(request.body);
  response.json(result);
};

module.exports = { sellerRegister,getSellers };
