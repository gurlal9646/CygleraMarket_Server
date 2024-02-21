const {
    saveRequest,getApprovals
  } = require("../services/requestForApproval.js");
  const logger = require("../utils/logger.js");


  const fetchApprovals = async function (request, response) {
    logger.info(`Get Approvals: ${JSON.stringify(request.body)}`);
    const result = await getApprovals(request.body, request.user);
    response.json(result);
  };
  
  const addRequest = async function (request, response) {
    logger.info(`Add Request: ${JSON.stringify(request.body)}`);
    const result = await saveRequest(request.body, request.user);
    response.json(result);
  };
  
  
  module.exports = { addRequest };
  