const express = require("express");

const router = express.Router();

const contractController = require("../../controllers/contractController");

router.post("/addContract", contractController.addContract);
router.get("/getContracts", contractController.contracts);
router.get("/getContracts/:contractId", contractController.contracts);
router.delete("/deleteContract/:contractId", contractController.deleteContract);

module.exports = router;
