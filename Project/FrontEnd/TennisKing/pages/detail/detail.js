// pages/detail/detail.js
const request = require('../../utils/request.js');
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    postId: 0,
    title: "",
    time: "",
    tags: [],
    author: "",
    view: 0,
    like: 0,
    forward: 0,
    content: "",
    cache: {},
    isLiked: false
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
      var month = date.month >= 10 ? date.month : "0" + date.month
      var day = date.day >= 10 ? date.day : "0" + date.day
      var hour = date.hour >= 10 ? date.hour : "0" + date.hour
      var minute = date.minute >= 10 ? date.minute : "0" + date.minute
      var time = month + "/" + day + " " + hour + ":" + minute
      var isLiked = Number(res.data.like) == 1
      if (post.forwardCount == null) post.forwardCount = 0
      if (post.viewCount == null) post.viewCount = 0
      if (post.likeCount == null) post.likeCount = 0
      
      // 清除所有格式
      // post.content = post.content.replace(/<([a-zA-Z]+)\s*[^><]*>/g, "<$1>")
      post.content = post.content.replace("src=\"", "src=\"https://wangqiudi.com")
      if (post.memberName == null) post.memberName = "网球帝小编"
      this.setData({
        postId: postId,
        title: title,
        time: time,
        tags: post.tags,
        author: post.memberName,
        view: post.viewCount,
        like: post.likeCount,
        forward: post.forwardCount,
        content: post.content,
        cache: post,
        isLiked: isLiked
      })
      wx.hideLoading()
    }
    var fail = res => {

    }
    wx.showLoading({
      title: "加载中",
    })
    request.reqPostDetail(postId, "temp", success, fail)
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
    console.log("转发")
    wx.showLoading({
      title: "加载中...",
    })
    const success = res => {
      console.log("转发访问接口成功 =========== ")
      wx.hideLoading()
    }
    const fail = res => {
      wx.hideLoading()
      console.log("转发访问接口失败 =========== ")
      console.log(res)
    }
    request.reqForward(this.data.postId, success, fail)
    return {
      title: this.data.title
    }
  },

  /**
   * 点赞
   */
  onBtnLikeTap: function (e) {
    console.log("点赞")
    if (this.data.isLiked){
      console.log("已点赞")
      return
    }
    var success = (res) => {
      console.log("点赞成功")

      var like = Number(this.data.like)
      this.setData({
        like: like + 1,
        isLiked: true
      })
      wx.setStorage({
        key: "need_refresh",
        data: true,
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