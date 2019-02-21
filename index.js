const getRawBody = require("raw-body");
const { insertAttendanceLog } = require("./src/InsertAttendanceLog.js");
const { responseBuilder } = require("./src/responseBuilder");

module.exports.handler = function(request, response, context) {
  getRawBody(request, async (err, data) => {
    responseBuilder.init(response);

    const token = request.headers.authorization;

    if (!token) {
      responseBuilder.sendResponse("Not Authorized", 407);
      throw "Not Authorized";
    }

    let attendanceLogs;
    try {
      attendanceLogs = JSON.parse(data.toString());
    } catch (error) {
      responseBuilder.sendResponse(`Invailed attendancelogs`, 409);
      throw `Invailed attendancelogs`;
    }

    const enrollmentId = request.queries.id;

    if (isNaN(enrollmentId) || !Array.isArray(attendanceLogs)) {
      responseBuilder.sendResponse(
        `enrollmentId NaN or attendanceLogs isn't Array`,
        411
      );
      throw `enrollmentId isNaN or attendanceLogs isn't Array`;
    }

    await insertAttendanceLog(enrollmentId, attendanceLogs, token);

    responseBuilder.sendResponse({ success: true }, 200);
  });
};
