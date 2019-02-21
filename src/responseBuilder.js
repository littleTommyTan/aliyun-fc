const responseBuilder = {
  response: null,
  init: resp => {
    responseBuilder.response = resp;
  },
  sendResponse: (body, code) => {
    const respBody = new Buffer.from(JSON.stringify(body));
    responseBuilder.response.setStatusCode(code);
    responseBuilder.response.setHeader("content-type", "application/json");
    responseBuilder.response.send(respBody);
  }
};
exports.responseBuilder = responseBuilder;
