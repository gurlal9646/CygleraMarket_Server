const { generateToken } = require("../services/tokenService");
const logger = require("../utils/logger.js");

const Token = async function (request, response) {
  logger.info(`Login Request: ${JSON.stringify(request.body)}`);
  const { email, password, roleId } = request.body;
  const tokenResponse = await generateToken({ email, password, roleId });
  response.json(tokenResponse);
};

module.exports = { Token };