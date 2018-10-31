// pages/playerNews/playerNews.js
const resources = require("../../utils/resources.js")
const menusCtrl = require("../../utils/menuCtrl.js")
const postCtrl = require("../../utils/postCtrl.js")
const request = require('../../utils/request.js')
const util = require('../../utils/util.js')

const tagCtrl = new menusCtrl()
const postPageCtrl = new postCtrl()

const tagsDefault = [
  { id: 0, name: "全部" }
]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    playerId: 0,
    news_post: {},
    currTagIdx: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var playerId = options.playerId
    this.reqHomeInfo(null, null, playerId)
  },

  reqHomeInfo: function (postId, menuId, playerId) {
    var that = this
    var success = res => {
      // tag
      for (var i = 0; i < tagsDefault.length; ++i) {
        tagCtrl.add(tagsDefault[i].id, tagsDefault[i].name)
      }
      var tags_res = res.data.tags
      for (var i = 0; i < tags_res.length; ++i) {
        tagCtrl.add(tags_res[i].id, tags_res[i].name)
      }
      // 资讯
      var posts_res = res.data.posts
      for (var i = 0; i < posts_res.length; ++i) {
        posts_res[i].idx = i
        var date = util.formatTime(new Date(posts_res[i].createTime * 1000))
        posts_res[i].time = date.month + "/" + date.day + "\n" + date.hour + ":" + date.minute
        postPageCtrl.add(posts_res[i].postId, posts_res[i])
        // posts[i].liked = false
      }

      var choosedTagId = tagCtrl.getChoosed()
      var tagsMenu = tagCtrl.getAll()

      var new_news_post = this.data.news_post
      var posts = postPageCtrl.getPost(0, choosedTagId, playerId)
      new_news_post.posts = posts
      new_news_post.tags = tagsMenu
      that.setData({
        playerId: playerId,
        currTagIdx: choosedTagId,
        news_post: new_news_post
      })

      wx.hideLoading()
    }
    var fail = res => {
      wx.hideLoading()
    }
    wx.showLoading({
      title: "加载中",
    })
    request.reqHomeInfo(postId, menuId, playerId, success, fail)
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

  onTagItemTap: function (e) {
    console.log("用户点击 tag, id: " + e.currentTarget.dataset.id + ", idx: " + e.currentTarget.dataset.idx)
    // console.log(e)
    var tapId = e.currentTarget.dataset.id
    var tapIdx = e.currentTarget.dataset.idx
    if (this.data.currTagIdx == tapIdx) {
      return
    }
    tagCtrl.setChoosed(tapId)
    var tagsMenu = tagCtrl.getAll()
    var new_news_post = this.data.news_post
    var posts = postPageCtrl.getPost(null, tapId, this.data.playerId)
    new_news_post.posts = posts
    new_news_post.tags = tagsMenu
    this.setData({
      currTagIdx: tapIdx,
      news_post: new_news_post
    })
  }
})