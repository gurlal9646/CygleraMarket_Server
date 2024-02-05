const express = require('express');

const router = express.Router();

const VerifyUser = require('../../middlewares/VerifyUser.js'); 

router.use(VerifyUser); // Protect all routes beneath this point

// Import other API routes

const usersRouter = require('./users.js');
const buyersRouter = require('./buyer.js');
const sellerRouter = require('./seller.js');
const loginRouter =  require('./login.js');


router.get("/test", async (request, response) => {
    console.log('inside test');
     return response.send('API is running successfully.');
 });
// Use the imported routes

router.use('/user', usersRouter);
router.use('/buyer', buyersRouter);
router.use('/seller', sellerRouter);
router.use('/login', loginRouter);






module.exports = router;