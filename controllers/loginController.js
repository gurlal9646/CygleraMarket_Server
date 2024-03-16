const { generateToken ,resetPassword,resetPasswordLink} = require("../services/tokenService");
const logger = require("../utils/logger.js");

const Token = async function (request, response) {
  logger.info(`Login Request: ${JSON.stringify(request.body)}`);
  const { email, password, roleId } = request.body;
  const tokenResponse = await generateToken({ email, password, roleId });
  response.json(tokenResponse);
};
//Link for reset password
const PasswordLink = async function (request, response) {
  logger.info(`Reset password Request: ${JSON.stringify(request.body)}`);
  const { email } = request.body;
  const tokenResponse = await resetPasswordLink({ email });
  response.json(tokenResponse);
};
// resetting password
const resPassword = async function (request, response) {
  logger.info(`Reset password Request: ${JSON.stringify(request.body)}`);

  const { password } = request.body; 
  const { userId, token } = request.params; 
  const tokenResponse = await resetPassword({ pass: { password }, userId, token });
  response.json(tokenResponse);
};


module.exports = { Token,PasswordLink,resPassword};