const express = require("express");

const router = express.Router();

const rfaController = require("../../controllers/requestForApprovalController");

router.get("/getApprovals", rfaController.fetchApprovals);

router.post("/addRequest", rfaController.addRequest);

router.get("/getConversation/:requestId", rfaController.getConvRequest);

//router.post("/addConversation/:requestId", rfaController.addConv);





module.exports = router;
