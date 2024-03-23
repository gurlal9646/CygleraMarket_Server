const {
    saveRequest,getApprovals,updateRequestStatus
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

  const updateRequest = async function (request, response) {
    logger.info(`Update Request Status RequestId: ${request.params.requestId}`);
    const result = await updateRequestStatus(request.params.requestId,request.body);
    response.json(result);
  };
  
  
  module.exports = { addRequest,fetchApprovals ,updateRequest};
  