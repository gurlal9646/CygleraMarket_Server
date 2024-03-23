const { requestWhitelist } = require("express-winston");
const {
    saveRequest,getApprovals,getConversation
  } = require("../services/requestForApproval.js");
  const logger = require("../utils/logger.js");


  const fetchApprovals = async function (request, response) {
    logger.info(`Get Approvals: ${JSON.stringify(request.body)}`);
    const result = await getApprovals(request.params.requestId, request.user);
    response.json(result);
  };
  
  const addRequest = async function (request, response) {
    logger.info(`Add Request: ${JSON.stringify(request.body)}`);
    const result = await saveRequest(request.body, request.user);
    response.json(result);
  };

  const  getConvRequest = async function (request, response) {
    const requestId = request.params.requestId;
    console.log(requestId);
    logger.info(`Get Conversation: ${JSON.stringify(request.body)}`);
    const result = await getConversation(requestId);
    response.json(result);
  };
  
  
  module.exports = { addRequest,fetchApprovals,getConvRequest };
  