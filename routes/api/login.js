const express = require("express");

const router = express.Router();

const loginController = require('../../controllers/loginController');

router.post("/token", loginController.Token);
router.post("/password-reset", loginController.resPassword);
router.post("/password-reset/:userId/:token", loginController.Token);







module.exports = router;