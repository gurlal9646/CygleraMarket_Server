const { generateToken ,resetPassword} = require("../services/tokenService");
const logger = require("../utils/logger.js");

const Token = async function (request, response) {
  logger.info(`Login Request: ${JSON.stringify(request.body)}`);
  const { email, password, roleId } = request.body;
  const tokenResponse = await generateToken({ email, password, roleId });
  response.json(tokenResponse);
};

const resPassword = async function (request, response) {
  logger.info(`Reset password Request: ${JSON.stringify(request.body)}`);
  const { email } = request.body;
  const tokenResponse = await resetPassword({ email });
  response.json(tokenResponse);
};



module.exports = { Token,resPassword };