const getRawBody = require("raw-body");
const jwt = require("jsonwebtoken");
const { insertAttendanceLog } = require("./src/InsertAttendanceLog.js");
const { responseBuilder } = require("./src/responseBuilder");

module.exports.handler = function(request, response, context) {
  getRawBody(request, async (err, data) => {
    responseBuilder.init(response);

    const userjwt = request.headers.userinfo;

    if (!userjwt) {
      responseBuilder.sendResponse("Not Authorized", 407);
      throw "Not Authorized";
    }

    const secret = process.env["JWT_SECRET"];
    const userinfo = jwt.verify(request.headers.userinfo, secret);

    if (!userinfo.token || !userinfo.enrollmentId) {
      responseBuilder.sendResponse("User Info Error", 408);
      throw "User Info Error";
    }

    let attendanceLogs;
    try {
      attendanceLogs = JSON.parse(data.toString());
    } catch (error) {
      responseBuilder.sendResponse(`Invailed attendancelogs`, 409);
      throw `Invailed attendancelogs`;
    }

    const enrollmentId = userinfo.enrollmentId;
    const token = userinfo.token;

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