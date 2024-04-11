// controllers/userController.js
const userService = require("../services/userService");
const { Roles } = require("../utils/Enums.js");
const logger = require("../utils/logger.js");


/// GET user details controller
async function getUserDetails(request, response) {
  logger.info(
    `GetUserDetails in User controller: ${JSON.stringify(request.body)}`
  );

  let roleId, userId;

  if (request.user.roleId === Roles.ADMIN) {
    roleId = request.query.roleId;
    userId = request.query.userId;
  } else {
    roleId = request.user.roleId;
    userId = request.user.userId;
  }

  try {
    const result = await userService.getUserDetails(roleId, userId);
    response.json(result);
  } catch (err) {
    console.error(err.message);
    response.status(500).send("Server Error");
  }
}

// PUT update user details controller
async function updateUserDetails(request, response) {
  logger.info(
    `UpdateUserDetails in User controller: ${JSON.stringify(request.body)}`
  );
  let roleId, userId;
  if (request.user.roleId === Roles.ADMIN) {
    roleId = request.query.roleId;
    userId = request.query.userId;
  } else {
    roleId = request.user.roleId;
    userId = request.user.userId;
  }
  try {
    const result = await userService.updateUserDetails(
      roleId,
      userId,
      request.body
    );
    response.json(result);
  } catch (err) {
    console.error(err.message);
    response.status(500).send("Server Error");
  }
}

const updatePassword = async function (request, response) {
  logger.info(
    `ChangePassword in User controller: ${JSON.stringify(request.body)}`
  );
  const result = await userService.changePassword(request.user, request.body);
  response.json(result);
};


const removeAccount = async function (request, response) {
  logger.info(
    `Delete Account in User controller: ${JSON.stringify(request.body)}`
  );
  const result = await userService.deleteAccount(request.user);
  response.json(result);
};
module.exports = { getUserDetails, updateUserDetails, updatePassword,removeAccount };
