class ApiResponse {
    constructor(code, subcode, message, data) {
      this.code = code;
      this.subcode = subcode;
      this.message = message;
      this.data = data;
    }
  }

  module.exports = ApiResponse;
