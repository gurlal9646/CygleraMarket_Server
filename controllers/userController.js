// controllers/userController.js
const userService = require('../services/userService');
const {
    ResponseCode,
    ResponseSubCode,
    ResponseMessage,
    Roles,
  } = require("../utils/Enums.js");

/// GET user details controller
async function getUserDetails(req, res) {
    let roleId, userId;

    if (req.user.roleId === Roles.ADMIN) {
        roleId = req.query.roleId;
        userId = req.query.userId;
    } else {
        roleId = req.user.roleId;
        userId = req.user.userId;
    }
    
    try {
        const userResponse = await userService.getUserDetails(roleId, userId);
        
        if (!userResponse) {
            return res.status(404).json("No user found");
        }
        
        console.log("User:", userResponse);
        res.json(userResponse);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}


// PUT update user details controller
async function updateUserDetails(req, res) {
    let roleId, userId ;
    if (req.user.roleId === Roles.ADMIN) {
        roleId = req.query.roleId;
        userId = req.query.userId;
    } else {
        roleId = req.user.roleId;
        userId = req.user.userId;
    }
    try {
        const user = await userService.updateUserDetails(roleId, userId, req.body);
        if (!user) {
            return res.status(404).json({ error: "User not found or invalid parameters" });
        }
        res.json({ message: "User details updated successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

module.exports = { getUserDetails,updateUserDetails};
