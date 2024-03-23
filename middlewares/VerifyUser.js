require("dotenv").config();

const jwt = require("jsonwebtoken");
const logger = require("../utils/logger.js");


const secret = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
  // Get the token from the Authorization header

  if (req.url.includes('/token') || req.url.includes('/register') || req.url.includes('/healthcheck')  || req.url.includes('/password-reset')|| req.url.includes('/login')) {
    // If it's the login path, skip token verification and proceed to the next middleware
    return next();
  }

  let token = req.headers["x-access-token"] || req.headers["authorization"];
 logger.info(`Token verification started`);

  // If a token is found, remove 'Bearer ' if it's present

  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  // If there is no token, return an error

  if (!token) {
    logger.error(`Token not available for verification!`);

    return res.status(403).json({
      success: false,
      message: "A token is required for authentication",
    });
  }

  // Try to verify the token

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded; 
  } catch (err) {
    logger.error(`Token verification failed`);
    return res.status(401).json({
      success: false,

      message: "Invalid token",
    });

  }

  return next(); // Proceed to the next middleware or route handler
};

module.exports = verifyToken;
