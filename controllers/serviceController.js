const {
    getServices,
    saveService,
    removeService,
  } = require("../services/serviceService.js");
  const logger = require("../utils/logger.js");
  
  const services = async (request, response) => {
    logger.info(`Get Services: ${JSON.stringify(request.body)}`);
    const result = await getServices(request.params.serviceId, request.user);
    response.json(result);
  };
  
  const addService = async function (request, response) {
    logger.info(`Add Service: ${JSON.stringify(request.body)}`);
    const result = await saveService(request.body, request.user);
    response.json(result);
  };
  
  const deleteService = async (request, response) => {
    logger.info(`Delete Service ServiceId: ${request.params.serviceId}`);
    const result = await removeService(request.params.serviceId, request.user);
    response.json(result);
  };
  
  module.exports = { addService, services, deleteService };
  