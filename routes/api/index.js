const express = require('express');

const router = express.Router();

const VerifyUser = require('../../middlewares/VerifyUser.js'); 

router.use(VerifyUser); // Protect all routes beneath this point

// Import other API routes

const usersRouter = require('./users.js');
const buyersRouter = require('./buyer.js');
const sellerRouter = require('./seller.js');
const loginRouter =  require('./login.js');


/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       $ref: '../../utils/models/BuyerInfo.js'
 */

/**
 * @swagger
 * /api/healthcheck:
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
    response.status(200).send("Server is healthy");
});
// Use the imported routes

router.use('/user', usersRouter);
router.use('/buyer', buyersRouter);
router.use('/seller', sellerRouter);
router.use('/login', loginRouter);






module.exports = router;