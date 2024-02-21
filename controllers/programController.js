const {
    getPrograms,
    saveProgram,
    removeProgram,
  } = require("../services/programService.js");
  const logger = require("../utils/logger.js");
  
  const programs = async (request, response) => {
    logger.info(`Register Seller: ${JSON.stringify(request.body)}`);
    const result = await getrPograms(request.params.programId, request.user);
    response.json(result);
  };
  
  const addProgram = async function (request, response) {
    logger.info(`Add Program: ${JSON.stringify(request.body)}`);
    const result = await saveProgram(request.body, request.user);
    response.json(result);
  };
  
  const deleteProgram = async (request, response) => {
    logger.info(`Delete Program ProgramId: ${request.params.programId}`);
    const result = await removeProgram(request.params.programId, request.user);
    response.json(result);
  };
  
  module.exports = { addProgram, programs, deleteProgram };
  