const express = require('express');

const router = express.Router();

const VerifyUser = require('../../middlewares/VerifyUser.js'); 

router.use(VerifyUser); // Protect all routes beneath this point

// Import other API routes

const usersRouter = require('./users.js');

// Use the imported routes

router.use('/user', usersRouter);


router.get("/test", async (request, response) => {

    return response.send('API is running successfully.');
});


module.exports = router;