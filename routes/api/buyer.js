
const express = require("express");

const router = express.Router();

const buyerController = require('../../controllers/buyerController');

/**
 * @swagger
 * /api/buyer:
 *   post:
 *     summary: Register a user as a buyer
 *     description: Endpoint to register a user as a buyer.
 *     tags:
 *       - Buyer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *     responses:
 *       '201':
 *         description: Buyer registered successfully
 *       '500':
 *         description: Internal Server Error
 */
router.post("/register", buyerController.register);

router.get("/getBuyers", buyerController.getBuyers);


module.exports = router;