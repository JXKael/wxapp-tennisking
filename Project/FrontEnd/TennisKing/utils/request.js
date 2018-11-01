var util = require('util.js');

/**
 * 获取主页信息
 */
const reqHomeInfo = (postId, menuId, playerId, success, fail) => {
  var data = {}
  if (postId != null) {
    data.postId = postId
  }
  if (playerId != null) {
    data.playerId = playerId
  }
  if (menuId != null) {
    data.menuId = menuId
  }
  requestData("index/", "POST", data, success, fail, null)
}

/**
 * 获取选手列表
 */
const reqPlayerInfo = (success, fail) => {
  requestData("index/player/", "POST", null, success, fail, null)
}

/**
 * 获取资讯详情
 */
const reqPostDetail = (postId, wechatId, success, fail) => {
  var data = {
    postId: postId,
    wechatId: null
  }
  requestData("index/post/", "POST", data, success, fail, null)
}

/**
 * 点赞
 */
const reqLike = (postId, wechatId, success, fail) => {
  var data = {
    postId: postId,
    wechatId: null // 暂时屏蔽
  }
  requestData("index/like/", "POST", data, success, fail, null)
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
  var xURL = "https://wangqiudi.com/" + url
  console.log(xURL)
  console.log(data)
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
  reqPlayerInfo: reqPlayerInfo,
  reqPostDetail: reqPostDetail,
  reqLike: reqLike
};