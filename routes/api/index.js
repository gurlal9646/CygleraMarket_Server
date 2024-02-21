const express = require("express");

const router = express.Router();

const VerifyUser = require("../../middlewares/VerifyUser.js");

router.use(VerifyUser); // Protect all routes beneath this point

// Import other API routes

const buyersRouter = require("./buyer.js");
const sellerRouter = require("./seller.js");
const loginRouter = require("./login.js");
const productRouter = require("./products.js");
const programRouter = require("./programs.js");
const serviceRouter = require("./services.js");
const rfaRouter = require("./requestForApproval.js");



const logger = require("../../utils/logger.js");

/**
 * @swagger
 * components:
 *   schemas:
 *     Buyer:
 *     Seller:
 *
 */

/**
 * @swagger
 *  healthcheck:
 *   get:
 *     summary: Check server health
 *     description: Endpoint to check if the server is healthy.
 *     tags:
 *       - HealthCheck
 *     responses:
 *       '200':
 *         description: Server is healthy
 */
router.get("/healthcheck", async (request, response) => {
  logger.info(`Server is healthy`);
  response.status(200).send("Server is healthy");
});
// Use the imported routes

router.use("/buyer", buyersRouter);
router.use("/seller", sellerRouter);
router.use("/login", loginRouter);
router.use("/product", productRouter);
router.use("/program", programRouter);
router.use("/service",serviceRouter);
router.use("/rfa",rfaRouter);

module.exports = router;
