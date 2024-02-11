const express = require("express");

const router = express.Router();

const loginController = require('../../controllers/loginController');

router.post("/token", loginController.Token);



module.exports = router;