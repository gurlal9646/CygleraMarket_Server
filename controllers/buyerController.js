const { registerBuyer,getAllBuyers } = require("../services/buyerService.js");
const logger = require("../utils/logger.js");


const register = async function (request, response) {
  logger.info(`Register Buyer in controller: ${JSON.stringify(request.body)}`);
  const result = await registerBuyer(request.body);
  response.json(result);
  
};

const getBuyers = async (request, response) => {
  logger.info(`Get Buyers in controller start ${Date.now()}`);
  const result = await getAllBuyers();
  logger.info(`Get Buyers in controller end ${Date.now()}`);
  response.json(result);
};

module.exports = { register, getBuyers };
