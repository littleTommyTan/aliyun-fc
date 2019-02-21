exports.BatchWriteRow = async (logs, sendRespCallBack) => {
  const rows = [];
  for (const log of logs) {
    rows.push({
      type: "PUT",
      condition: new TableStore.Condition(
        TableStore.RowExistenceExpectation.IGNORE,
        null
      ),
      primaryKey: [{ uuid: log.uuid }, { id: TableStore.PK_AUTO_INCR }],
      attributeColumns: [
        { happenedAt: log.happenedAt },
        { enrollmentId: log.enrollmentId },
        { event: log.event },
        { key: log.key }
      ],
      returnContent: { returnType: TableStore.ReturnType.Primarykey }
    });
  }
  var params = {
    tables: [
      {
        tableName: "Attendance",
        rows: rows
      }
    ]
  };

  await client.batchWriteRow(params, (err, data) => {
    if (err) sendRespCallBack({ err: true, msg: err });
  });
};

// ------------------------ PutRow 方法 ------------------------
// function putRow(callBack) {
//   //获取实例下所有的表名
//   for (let index = 1; index < 10; index += 1) {
//     console.log(`---------------putRow in Attendance  ${index} ------------\n`);
//     const params = {
//       tableName: 'Attendance',
//       condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
//       primaryKey: [{ uuid: 'tommytan-012345' }, { id: TableStore.PK_AUTO_INCR }],
//       attributeColumns: [
//         { happenedAt: '2018-09-04T03:01:59.643Z' },
//         { enrollmentId: index },
//         { event: 24002 },
//         { key: 'C1.L1.2.0.C0' },
//       ],
//       returnContent: { returnType: TableStore.ReturnType.Primarykey },
//     };
//     client.putRow(params, callBack);
//   }
// }
// putRow(callBack);

// ------------------------ GetRange方法 ------------------------
// async function getRange(callBack) {
//   const params = {
//     tableName: 'Attendance',
//     direction: TableStore.Direction.FORWARD,
//     inclusiveStartPrimaryKey: [{ uuid: 'tommytan-012345' }, { id: TableStore.INF_MIN }],
//     exclusiveEndPrimaryKey: [{ uuid: 'tommytan-012345' }, { id: TableStore.INF_MAX }],
//     sorters: [
//       {
//         fieldSort: {
//           fieldName: 'enrollmentId',
//           order: TableStore.SortOrder.SORT_ORDER_DESC,
//         },
//       },
//     ],
//     limit: 100,
//     returnContent: { returnType: TableStore.ReturnType.Primarykey },
//   };

//   client.getRange(params, function(err, data) {
//     if (err) {
//       console.log('error:', err);
//       return;
//     }

//     console.log(data);
//   });
// }
// getRange(callBack);

// --------------------- MatchAllQuery方法 ------------------------
// async function MatchAllQuery(callBack) {
//   client.search(
//     {
//       tableName: 'Attendance',
//       searchQuery: {
//         sorters: [
//           {
//             fieldSort: {
//               fieldName: 'enrollmentId',
//               order: TableStore.SortOrder.SORT_ORDER_DESC,
//             },
//           },
//         ],
//         offset: 0,
//         limit: 10, //如果只为了取行数，但不需要具体数据，可以设置limit=0，即不返回任意一行数据。
//         query: {
//           queryType: TableStore.QueryType.MATCH_ALL_QUERY,
//         },
//         getTotalCount: true, // 结果中的TotalCount可以表示表中数据的总行数， 默认false不返回
//       },
//       columnToGet: {
//         //返回列设置：RETURN_SPECIFIED(自定义),RETURN_ALL(所有列),RETURN_NONE(不返回)
//         returnType: TableStore.ColumnReturnType.RETURN_SPECIFIED,
//         returnNames: ['Col_1', 'Col_2', 'Col_3'],
//       },
//     },
//     function(err, data) {
//       if (err) {
//         console.log('error:', err);
//         return;
//       }
//       console.log('success:', JSON.stringify(data, null, 2));
//     },
//   );
// }
// MatchAllQuery(callBack);
