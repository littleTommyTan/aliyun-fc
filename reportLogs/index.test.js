/**
 * 纯测试代码，无使用价值
 * 暂时保留
 */
const Axios = require("axios");
/**
 * @description GetRange方法拉下所有同uuid的Logs
 */
async function getDatas() {
  const payload = {
    uuid: "1a004d63-8584-4cf4-838c-f8d3dbb4ae26",
    enrollmentId: 1234,
    token:'jo12y314912uh312u3hi12h3210u'
  };
  const axios = Axios.create({
    baseURL: "http://127.0.0.1:7001/",
    timeout: 30000
  });
  axios.interceptors.request.use(request => {
    request.headers.authorization = payload.token;
    return request;
  });

  for (let retryCount = 0; retryCount < 5; retryCount += 1) {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, retryCount * 1000);
    });

    try {
      const result = await axios.post("/enrollment/reportAttendance", payload);
      console.log("success result:", result.data);
      return result;
    } catch (error) {
      console.error(`handle End failed. Retrying!`, error);
    }
  }
  console.error(`handle End failed in retry maxium`);
  throw "handle End failed in retry maxium, closed";
  // try {
  //   const data = [
  //     {
  //       happenedAt: '2018-09-04T03:01:59.643Z',
  //       enrollmentId: 160,
  //       event: 21102,
  //       key: 'C1.L1.2.0.C0',
  //       uuid: '1a004d63-8584-4cf4-838c-f8d3dbb4ae26',
  //     },
  //     {
  //       happenedAt: '2018-09-04T03:01:59.646Z',
  //       enrollmentId: 160,
  //       event: 25001,
  //       key: 'C1.L1.2.0.Q1',
  //       uuid: '1a004d63-8584-4cf4-838c-f8d3dbb4ae26',
  //     },
  //     {
  //       happenedAt: '2018-09-04T03:01:59.647Z',
  //       enrollmentId: 160,
  //       event: 26001,
  //       key: 'C1.L1.2.0.Q1',
  //       uuid: '1a004d63-8584-4cf4-838c-f8d3dbb4ae26',
  //     },
  //   ];
  //   const res = await Axios.post(
  //     `https://1870734230320266.cn-shanghai.fc.aliyuncs.com/2016-08-15/proxy/smartpi-attendance/test-nodejs8/`,
  //     data,
  //   );
  //   console.log(res.data);
  // } catch (error) {
  //   console.log(error.response.data);
  // }
}
getDatas();
