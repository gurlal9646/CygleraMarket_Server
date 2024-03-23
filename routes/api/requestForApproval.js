const express = require("express");

const router = express.Router();

const rfaController = require("../../controllers/requestForApprovalController");

router.get("/getApprovals", rfaController.fetchApprovals);
router.post("/addRequest", rfaController.addRequest);
router.put("/updateRequest/:requestId", rfaController.updateRequest);
router.post("/addConversation", rfaController.saveConversation);
router.get("/getConversation/:requestId", rfaController.getConvRequest);

module.exports = router;
