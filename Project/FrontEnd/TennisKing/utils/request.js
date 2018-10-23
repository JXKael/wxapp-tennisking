var util = require('util.js');

/**
 * 获取主页信息
 */
const reqHomeInfo = (maxID, playerID, success, fail) => {
  var data = null
  if (maxID != null) {
    data.maxID = maxID
  }
  if (playerID != null) {
    data.playerID = playerID
  }
  requestData("index/", "GET", data, success, fail, null)
}

/**
 * 获取选手列表
 */
const reqPlayerInfo = (success, fail) => {
  requestData("index/player/", "GET", null, success, fail, null)
}

/**
 * 网络请求基本方法
 * @param url {string} 请求url
 * @param data {object} 参数
 * @param successCallback {function} 成功回调函数
 * @param failCallback {function} 失败回调函数
 * @param completeCallback {function} 完成回调函数
 * @returns {void}
 */
function requestData(url, method, data, successCallback, failCallback, completeCallback) {
  var xURL = "http://39.104.201.188/" + url
  console.log(xURL)
  wx.request({
    url: xURL,
    data: data,
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    method: method,
    success: function (res) {
      console.log(res)
      util.isFunction(successCallback) && successCallback(res);
      // else
      //   util.isFunction(failCallback) && failCallback(res);
    },
    fail: function (res) {
      console.log("failed")
      console.log(res)
      util.isFunction(failCallback) && failCallback(res);
    },
    complete: function (res) {
      util.isFunction(completeCallback) && completeCallback(res);
    }
  });
}

module.exports = {
  requestData: requestData,
  reqHomeInfo: reqHomeInfo,
  reqPlayerInfo: reqPlayerInfo
};