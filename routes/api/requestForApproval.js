const express = require("express");

const router = express.Router();

const rfaController = require("../../controllers/requestForApprovalController");

router.get("/getApprovals", rfaController.fetchApprovals);

router.post("/addRequest", rfaController.addRequest);

router.put("/updateRequest/:requestId", rfaController.updateRequest);



module.exports = router;
