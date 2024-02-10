const express = require("express");

const router = express.Router();

const productontroller = require('../../controllers/productController');

router.post("/addProduct", productontroller.addProduct);
router.get("/getProducts", productontroller.products);


module.exports = router;