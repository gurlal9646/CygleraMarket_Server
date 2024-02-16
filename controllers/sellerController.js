const { registerSeller } = require("../services/sellerService.js");
const logger = require("../utils/logger.js");

const sellerRegister = async function (request, response) {
  logger.info(`Register Seller: ${JSON.stringify(request.body)}`);
  const result = await registerSeller(request.body);
  response.json(result);
};

module.exports = { sellerRegister };
