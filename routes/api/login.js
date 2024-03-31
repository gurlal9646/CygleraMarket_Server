const express = require("express");

const router = express.Router();

const loginController = require('../../controllers/loginController');
const userController = require('../../controllers/userController')

router.post("/token", loginController.Token);
router.post("/password-reset", loginController.PasswordLink);
router.put("/password-reset/:userId/:token", loginController.resPassword);


router.get('/details', userController.getUserDetails);
router.put('/details', userController.updateUserDetails);









module.exports = router;