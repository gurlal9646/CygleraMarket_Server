const express = require("express");

const router = express.Router();

const loginController = require('../../controllers/loginController');
const userController = require('../../controllers/userController')

router.post("/token", loginController.Token);
router.post("/sendPasswordResetLink", loginController.PasswordLink);
router.put("/resetPassword/:userId/:token", loginController.resPassword);
router.post("/validateOTP", loginController.ValidateOTP);



router.get('/details', userController.getUserDetails);
router.put('/details', userController.updateUserDetails);


module.exports = router;