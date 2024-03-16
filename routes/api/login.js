const express = require("express");

const router = express.Router();

const loginController = require('../../controllers/loginController');

router.post("/token", loginController.Token);
router.post("/password-reset", loginController.PasswordLink);
router.post("/password-reset/:userId/:token", loginController.resPassword);







module.exports = router;