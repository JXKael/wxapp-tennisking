var util = require('util.js');

/**
 * 获取主页信息
 */
function reqHomeInfo(successCallback, failCallback) {
  requestData("index", "GET", null, successCallback, failCallback, null)
}

/**
 * 网络请求基本方法
 * @param url {string} 请求url
 * @param data {object} 参数
 * @param successCallback {function} 成功回调函数
 * @param errorCallback {function} 失败回调函数
 * @param completeCallback {function} 完成回调函数
 * @returns {void}
 */
function requestData(url, method, data, successCallback, failCallback, completeCallback) {
  wx.request({
    url: "http://39.104.201.188/" + url,
    data: data,
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    method: method,
    success: function (res) {
      // if (res.data.error == 0)
      util.isFunction(successCallback) && successCallback(res);
      // else
      //   util.isFunction(failCallback) && failCallback(res);
    },
    fail: function () {
      util.isFunction(failCallback) && failCallback(res);
    },
    complete: function () {
      util.isFunction(completeCallback) && completeCallback(res);
    }
  });
}

module.exports = {
  requestData: requestData,
  reqHomeInfo: reqHomeInfo
};