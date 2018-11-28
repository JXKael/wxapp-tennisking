var util = require('util.js');

/**
 * 获取主页信息
 */
const reqHomeInfo = (postId, menuId, playerId, tagId, createTime, success, fail) => {
  var data = {}
  // if (postId != null) {
  //   data.postId = postId
  // }
  if (menuId != null && Number(menuId) != 0) {
    data.menuId = menuId
  }
  if (playerId != null) {
    data.playerId = playerId
  }
  if (tagId != null && Number(tagId) != 0) {
    data.tagId = tagId
  }
  if (createTime != null) {
    data.createTime = createTime
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
 * 转发
 */
const reqForward = (postId, success, fail) => {
  var data = {
    postId: postId
  }
  requestData("index/forward/", "POST", data, success, fail, null)
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
  reqLike: reqLike,
  reqForward: reqForward
};