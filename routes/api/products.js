const express = require("express");

const router = express.Router();

const productController = require("../../controllers/productController");

router.post("/addProduct", productController.addProduct);
router.get("/getProducts", productController.products);
router.get("/getProducts/:productId", productController.products);
router.delete("/deleteProduct/:productId", productController.deleteProduct);

module.exports = router;
