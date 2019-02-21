const Axios = require("axios");

const TableStore = require("tablestore");
const Long = TableStore.Long;
const { responseBuilder } = require("./responseBuilder");

const accessKeyId = process.env["KEY_ID"];
const secretAccessKey = process.env["KEY_SECRET"];
const instanceName = process.env["TABLESTORE_INSTANCE"];
const endpoint = process.env["TABLESTORE_ENDPOINT"];
const tableName = process.env["TABLE_NAME"];

// 表格存储对象
const tablestoreClient = new TableStore.Client({
  accessKeyId,
  secretAccessKey,
  endpoint,
  instancename: instanceName,
  maxRetries: 20
});

const AttendanceLogEvent = {
  PART_END: 21102,
  LESSON_EVALUATE: 21004
};

// exports.findCachedOngoingAttendanceIdByUuid = async uuid => {
//   const params = {
//     tableName: "Attendance",
//     direction: TableStore.Direction.FORWARD,
//     inclusiveStartPrimaryKey: [{ uuid }, { id: TableStore.INF_MIN }],
//     exclusiveEndPrimaryKey: [{ uuid }, { id: TableStore.INF_MAX }],
//     limit: 1,
//     returnContent: { returnType: TableStore.ReturnType.Primarykey }
//   };

//   try {
//     const attendance = await tablestoreClient.getRange(params);
//     if (attendance.rows.length < 1) {
//       console.log("no AttendanceId");
//       return null;
//     }
//     console.log(
//       "AttendanceId found",
//       attendance.rows[0].primaryKey[1].value.toNumber()
//     );

//     return attendance.rows[0].primaryKey[1].value.toNumber(); //attendanceId
//   } catch (error) {
//     responseBuilder.sendResponse(`findAttendanceId failed`, 412);
//     throw "findCachedOngoingAttendanceIdByUuid collapsed";
//   }
// };

// exports.createLessonAttendance = async (enrollmentId, progressKey, uuid) => {
//   //获取实例下所有的表名
//   const params = {
//     tableName: "Attendance",
//     condition: new TableStore.Condition(
//       TableStore.RowExistenceExpectation.IGNORE,
//       null
//     ),
//     primaryKey: [{ uuid }, { id: TableStore.PK_AUTO_INCR }],
//     attributeColumns: [
//       { enrollmentId },
//       { progressKey: JSON.stringify(progressKey) }
//     ],
//     returnContent: { returnType: TableStore.ReturnType.Primarykey }
//   };
//   try {
//     const newAttendance = await tablestoreClient.putRow(params);
//     console.log(
//       "new Attendance created",
//       newAttendance.row.primaryKey[1].value.toNumber()
//     );
//     return newAttendance.row.primaryKey[1].value.toNumber();
//   } catch (error) {
//     responseBuilder.sendResponse(`createAttendance failed`, 413);
//     throw "createLessonAttendance collapsed";
//   }
// };

exports.createManyAttendanceLogs = async attendanceLogs => {
  const rows = [];

  for (const log of attendanceLogs) {
    rows.push({
      type: "PUT",
      condition: new TableStore.Condition(
        TableStore.RowExistenceExpectation.IGNORE,
        null
      ),
      primaryKey: [
        // { attendanceId: Long.fromNumber(log.attendanceId) },
        { uuid: log.uuid },
        { enrollmentId: Long.fromNumber(log.enrollmentId) },
        { id: TableStore.PK_AUTO_INCR }
      ],
      attributeColumns: [
        { token: log.token },
        { happenedAt: log.happenedAt },
        { event: log.event },
        { key: log.key }
      ],
      returnContent: { returnType: TableStore.ReturnType.Primarykey }
    });
  }
  const params = {
    tables: [
      {
        tableName: tableName,
        rows: rows
      }
    ]
  };
  try {
    const result = await tablestoreClient.batchWriteRow(params);
  } catch (error) {
    console.error(error);

    responseBuilder.sendResponse(`createManyAttendanceLogs failed`, 414);
    throw "createManyAttendanceLogs collapsed";
  }
};

exports.handleLessonPartEndOrEvaluateEventLog = async (logs, payload) => {
  const partEndAndEvaluateLogs = logs.filter(
    attendancelog =>
      attendancelog.event === AttendanceLogEvent.PART_END ||
      attendancelog.event === AttendanceLogEvent.LESSON_EVALUATE
  );

  if (partEndAndEvaluateLogs.length) {
    // TODO
    // 请求服务器生成报告

    const axios = Axios.create({
      baseURL: "http://47.101.50.54:7001/",
      timeout: 30000
    });

    axios.interceptors.request.use(request => {
      request.headers.authorization = payload.token;
      return request;
    });

    for (let retryCount = 0; retryCount < 10; retryCount += 1) {
      // 延迟重发
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, retryCount * 500);
      });

      try {
        const result = await axios.post(
          "/enrollment/reportAttendance",
          payload
        );
        return result;
      } catch (error) {
        console.error(`handle End failed. Retrying!`, error);
      }
    }
    responseBuilder.sendResponse(`handle End failed in retry maxium`, 415);
    throw "handle End failed in retry maxium, closed";
  }
};
