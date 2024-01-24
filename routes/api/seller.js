const express = require("express");

const router = express.Router();

const sellerController = require('../../controllers/sellerController');

router.post("/register", sellerController.sellerRegister);

module.exports = router;