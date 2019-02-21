const moment = require("moment");
const ProgressKey = require("./ProgressKey");
const {
  createManyAttendanceLogs,
  handleLessonPartEndOrEvaluateEventLog
} = require("./tableStoreClient");
const { createMapBy } = require("./createMapBy");

exports.insertAttendanceLog = async (enrollmentId, logs, token) => {
  const logMap = createMapBy(logs, "uuid");
  console.log(logMap.keys());

  const attendanceLogs = [];
  for (const [uuid, logs] of logMap) {
    // 过滤有效log
    const filteredLogs = logs.filter(log => {
      const isValid = moment(log.happenedAt).isValid();
      if (!isValid) {
        console.error(`Invalid AttendanceLog.happenedAt value`, {
          uuid,
          enrollmentId,
          log
        });
      }
      return isValid;
    });

    // 格式化ProgressKey
    for (const log of filteredLogs) {
      const attendanceLog = {
        uuid,
        enrollmentId,
        token,
        key: log.key,
        event: log.event,
        happenedAt: log.happenedAt
      };
      attendanceLogs.push(attendanceLog);
    }
  }
  if (!attendanceLogs.length) {
    return [];
  }

  // Create attendance logs
  await createManyAttendanceLogs(attendanceLogs);

  // handle Part_End & LESSON_EVALUATE
  await handleLessonPartEndOrEvaluateEventLog(attendanceLogs, {
    token:attendanceLogs[0].token,
    uuid: attendanceLogs[0].uuid,
    enrollmentId
  });
};
