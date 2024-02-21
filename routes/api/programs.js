const express = require("express");

const router = express.Router();

const programController = require("../../controllers/programController");

router.post("/addProgram", programController.addProgram);
router.get("/getPrograms", programController.programs);
router.get("/getPrograms/:programId", programController.programs);
router.delete("/deleteProgram/:programId", programController.deleteProgram);

module.exports = router;
