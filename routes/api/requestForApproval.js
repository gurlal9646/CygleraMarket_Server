const express = require("express");

const router = express.Router();

const rfaController = require("../../controllers/requestForApprovalController");

router.post("/addRequest", rfaController.addRequest);


module.exports = router;
