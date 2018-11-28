// pages/playerNews/playerNews.js
const resources = require("../../utils/resources.js")
const menusCtrl = require("../../utils/menuCtrl.js")
const postCtrl = require("../../utils/postCtrl.js")
const request = require('../../utils/request.js')
const util = require('../../utils/util.js')

var SCREEN_CONVERT_RATIO = 1

const tagCtrl = new menusCtrl()
const postPageCtrl = new postCtrl()

const top_loading_threshold = 80

var needNewPost = false
var oldestPostId = 0
var oldestPostTime = 0

var page = 1
var isUpdating = false

const tagsDefault = [
  { id: 0, name: "全部", weight: 999999999 }
]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    playerId: 0,
    playerName: "",
    news_post: {},
    currTagIdx: 0,
    isBottom: false,
    hasNoMore: false,
    isTop: true,
    topLoading: {
      top_loading_height: '0rpx',
      top_loading_fill: '0rpx'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置page-scroll的高
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        SCREEN_CONVERT_RATIO = 750 / res.windowWidth
        var windowHeight = (res.windowHeight * SCREEN_CONVERT_RATIO); //将高度乘以换算后的该设备的rpx与px的比例
        that.setData({
          windowHeight: windowHeight + "rpx",
          scrollHeight: (windowHeight - 90) + "rpx"
        })
        console.log("window height: " + windowHeight) //最后获得转化后得rpx单位的窗口高度
      }
    })
    postPageCtrl.clean()
    var playerId = options.playerId
    wx.setNavigationBarTitle({
      title: options.shortName
    })
    this.setData({
      playerId: options.playerId,
      playerName: options.playerName
    })
    page = 1
    this.reqHomeInfo(null, null, playerId, null, true)
  },


  /**
   * 请求资讯
   * @param postId {string} 最后一条postId，null代表请求新数据
   * @param menuId {string} 当前menuId，null代表全部菜单
   * @param playerId {string} 当前playerId，null代表全部球员
   * @param showLoading {boolean} 是否显示加载中toast
   */
  reqHomeInfo: function (postId, menuId, playerId, createTime, showLoading) {
    var that = this
    isUpdating = true
    var success = res => {
      isUpdating = false
      // tag
      for (var i = 0; i < tagsDefault.length; ++i) {
        tagCtrl.add(tagsDefault[i].id, tagsDefault[i])
      }
      var tags_res = res.data.tags
      for (var i = 0; i < tags_res.length; ++i) {
        tagCtrl.add(tags_res[i].id, tags_res[i])
      }
      // 资讯
      var posts_res = res.data.posts
      for (var i = 0; i < posts_res.length; ++i) {
        postPageCtrl.polishPostForPlayer(posts_res[i], that.data.playerName)
        postPageCtrl.add(posts_res[i].postId, posts_res[i])
      }
      var hasNoMore = posts_res.length < 10
      if (posts_res.length > 0) {
        oldestPostId = posts_res[posts_res.length - 1].postId
        oldestPostTime = posts_res[posts_res.length - 1].createTime
      }
      needNewPost = false

      var choosedTagId = tagCtrl.getChoosed()
      var tagsMenu = tagCtrl.getAll()

      var new_news_post = this.data.news_post
      var posts = postPageCtrl.getPost(0, choosedTagId, playerId, false, page)
      new_news_post.posts = posts
      new_news_post.tags = tagsMenu
      that.setData({
        currTagIdx: choosedTagId,
        news_post: new_news_post,
        isBottom: false,
        hasNoMore: hasNoMore,
      })

      wx.hideLoading()
    }
    var fail = res => {
      isUpdating = false
      wx.hideLoading()
    }
    if (showLoading) {
      wx.showLoading({
        title: "加载中",
      })
    }
    request.reqHomeInfo(postId, menuId, playerId, createTime, success, fail)
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
    var that = this
    wx.getStorage({
      key: "need_refresh",
      success: function (res) {
        console.log("读取缓存成功")
        if (res.data) {
          console.log("需要更新")
          page = 1
          that.reqHomeInfo(null, null, that.data.playerId, null, false)
        }
      },
    })
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
   * 点击标签
   */
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
    page = 1
    var posts = postPageCtrl.getPost(null, tapId, this.data.playerId, false, page)
    new_news_post.posts = posts
    new_news_post.tags = tagsMenu
    this.setData({
      currTagIdx: tapIdx,
      news_post: new_news_post
    })
  },

  /**
   * 页面滑动框【触顶】事件
   */
  onBodyScrollYToUpper: function (e) {
    console.log("触顶事件")
    // console.log(e);
    if (this.data.isTop) return
    var topLoading = {
      top_loading_height: "0rpx",
      top_loading_fill: "0rpx"
    }
    this.setData({
      // isTop: true,
      topLoading: topLoading
    })
  },

  /**
   * 页面滑动框【触底】事件
   */
  onBodyScrollYTolower: function (e) {
    console.log("竖向滑动触底")
    if (this.data.isBottom) return
    if (this.data.hasNoMore) return
    console.log(e)

    this.setData({
      isBottom: true
    })
    if (!isUpdating) ++page
    this.reqHomeInfo(oldestPostId, null, this.data.playerId, oldestPostTime, false)
  },

  /**
   * 竖向【滑动】事件
   */
  onBodyScrollY: function (e) {
    // console.log(e)
    if (e.detail.scrollTop <= 0) {
      if (this.data.isTop) {
        var absScrollTop = Math.abs(e.detail.scrollTop)
        // 触顶刷新
        var ballFill = 1 - absScrollTop / top_loading_threshold
        if (ballFill < 0) {
          if (!needNewPost) {
            needNewPost = true
            wx.vibrateShort()
          }
          ballFill = 0
        }
        if (ballFill >= 1) {
          ballFill = 1
        }
        var topLoading = {
          top_loading_height: String(absScrollTop * SCREEN_CONVERT_RATIO) + "rpx",
          top_loading_fill: String(ballFill * 50) + "rpx"
        }
        this.setData({
          topLoading: topLoading
        })
      }
    }
  },

  /**
   * 触摸结束，用于下滑刷新
   */
  onBodyTouchEnd: function (e) {
    console.log("触摸结束")
    if (this.data.isTop) {
      if (needNewPost) {
        this.reqHomeInfo(null, null, this.data.playerId, null, true)
      }
    }
  },

  /**
   * 点击新闻item
   */
  onNewsItemTap: function (e) {
    console.log("点击赛事新闻中的item，postId: " + e.currentTarget.dataset.postid + ", idx: " + e.currentTarget.dataset.idx)
    // console.log(e)
    if (!e.currentTarget.dataset.canfold) return
    var new_news_post = this.data.news_post
    new_news_post.posts[e.currentTarget.dataset.idx].isFold = !new_news_post.posts[e.currentTarget.dataset.idx].isFold
    this.setData({
      news_post: new_news_post
    })
  },

  /**
   * 点击选手名称
   */
  onPlayerNameTap: function (e) {
    console.log("点击赛事新闻中的选手名称，postId: " + e.currentTarget.dataset.postid + ", idx: " + e.currentTarget.dataset.idx + ", playerId: " + e.currentTarget.dataset.playerid)
    // console.log(e)
  },

  /**
   * 点击转发
   */
  onRepostTap: function (e) {
    console.log("点击转发，postId: " + e.currentTarget.dataset.postid + ", idx: " + e.currentTarget.dataset.idx)
    // console.log(e)
    var postId = e.currentTarget.dataset.postid
    wx.navigateTo({
      url: "../detail/detail?postId=" + postId,
    })
  },

  onLikeTap: function (e) {
    console.log("点赞, postId: " + e.currentTarget.dataset.postid + ", idx: " + e.currentTarget.dataset.idx)
    var that = this
    var postId = e.currentTarget.dataset.postid
    var idx = e.currentTarget.dataset.idx
    if (this.data.news_post.posts[idx].liked) {
      console.log("已点赞")
      return
    }
    var success = (res) => {
      console.log("点赞成功")

      var likeCount = Number(res.data.post.likeCount)
      var new_news_post = that.data.news_post
      var aPost = new_news_post.posts[idx]
      aPost.likeCount = Number(aPost.likeCount) + 1
      aPost.liked = true
      postPageCtrl.add(postId, aPost)
      this.setData({
        news_post: new_news_post
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
    request.reqLike(postId, "wechat-id", success, fail)
  }
})