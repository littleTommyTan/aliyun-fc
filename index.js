const getRawBody = require("raw-body");
// const jwt = require("jsonwebtoken");
const { insertAttendanceLog } = require("./src/InsertAttendanceLog.js");
const { responseBuilder } = require("./src/responseBuilder");

module.exports.handler = function(request, response, context) {
  getRawBody(request, async (err, data) => {
    responseBuilder.init(response);

    const attendanceLogs = JSON.parse(data.toString());
    const enrollmentId = 1234;
    const userId = "useridididdididididid";
    
    if (isNaN(enrollmentId) || !Array.isArray(attendanceLogs)) {
      responseBuilder.sendResponse(
        `enrollmentId NaN or attendanceLogs isn't Array`,
        411
      );
      throw `enrollmentId isNaN or attendanceLogs isn't Array`;
    }

    await insertAttendanceLog(enrollmentId, attendanceLogs, userId);

    responseBuilder.sendResponse({ success: true }, 200);
  });
};
