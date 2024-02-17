const express = require("express");

const router = express.Router();

const serviceController = require("../../controllers/serviceController");

router.post("/addService", serviceController.addService);
router.get("/getServices", serviceController.services);
router.get("/getServices/:serviceId", serviceController.services);
router.delete("/deleteService/:serviceId", serviceController.deleteService);

module.exports = router;
