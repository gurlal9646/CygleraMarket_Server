const {
    getContracts,
    saveContract,
    removeContract,
  } = require("../services/contractService.js");
  const logger = require("../utils/logger.js");
  
  const contracts = async (request, response) => {
    logger.info(`Register Seller: ${JSON.stringify(request.body)}`);
    const result = await getContracts(request.params.contractId, request.user);
    response.json(result);
  };
  
  const addContract = async function (request, response) {
    logger.info(`Add Contract: ${JSON.stringify(request.body)}`);
    const result = await saveContract(request.body, request.user);
    response.json(result);
  };
  
  const deleteContract = async (request, response) => {
    logger.info(`Delete Contract ContractId: ${request.params.contractId}`);
    const result = await removeContract(request.params.contractId, request.user);
    response.json(result);
  };
  
  module.exports = { addContract, contracts, deleteContract };
  