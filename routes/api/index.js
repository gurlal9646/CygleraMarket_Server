const express = require('express');

const router = express.Router();

const VerifyUser = require('../../middlewares/VerifyUser.js'); 

router.use(VerifyUser); // Protect all routes beneath this point

// Import other API routes

const usersRouter = require('./users.js');

const buyersRouter = require('./buyer.js');


// Use the imported routes

router.use('/user', usersRouter);
router.use('/buyer', buyersRouter);



router.get("/test", async (request, response) => {

    return response.send('API is running successfully.');
});


module.exports = router;