// pages/detail/detail.js
const request = require('../../utils/request.js');
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    postId: 0,
    title: "美网 男单西里奇会师锦织圭 米尔曼逆转费德勒",
    time: "02/30 05:40",
    tags: [],
    author: "",
    view: 0,
    like: 0,
    content: "",
    cache: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postId = options.postId
    var success = res => {
      var post = res.data.post
      var title = post.title
      var date = util.formatTime(new Date(post.createTime * 1000))
      var time = date.month + "/" + date.day + " " + date.hour + ":" + date.minute
      this.setData({
        postId: postId,
        title: title,
        time: time,
        tags: post.tags,
        author: post.memberName,
        view: post.viewCount,
        like: post.likeCount,
        content: post.content,
        cache: post
      })
      wx.hideLoading()
    }
    var fail = res => {

    }
    wx.showLoading({
      title: "加载中",
    })
    request.reqPostDetail(postId, "f-magician", success, fail)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 点赞
   */
  onBtnLikeTap: function (e) {
    console.log("点赞")
    var success = (res) => {
      console.log("点赞成功")
      console.log(res.data)
      var like = this.data.like
      this.setData({
        like: like + 1
      })
      var cacheData = null
      wx.getStorage({
        key: 'cache_post',
        success: function(cache) {
          cacheData = cache.data
          cacheData.likeCount = res.data.post.likeCount
          cacheData.viewCount = res.data.post.viewCount
          wx.setStorage({
            key: "cache_post",
            data: cacheData,
          })
        },
      })
      wx.hideLoading()
    }
    var fail = (res) => {
      wx.hideLoading()
    }
    wx.showLoading({
      title: "加载中",
    })
    request.reqLike(this.data.postId, "f-magician", success, fail)
  }
})