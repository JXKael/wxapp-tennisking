// pages/home/home.js
const resources = require("../../utils/resources.js")
const menusCtrl = require("../../utils/menuCtrl.js")
const tagsCtrl = require("../../utils/tagsCtrl.js")
const request = require('../../utils/request.js');

var SCREEN_CONVERT_RATIO = 1
const top_offset = 60
const head_alpha = 32
const body_scroll_sudden = 50
const top_loading_threshold = 80
var isVibrate = false
const newsMenu = new menusCtrl()
const playersMenu = new menusCtrl()

const newsDefault = [
  { id: 0, name: "全部" }
]

const playersDefault = [
  { id: 0, name: "A" },
  { id: 1, name: "B" },
  { id: 2, name: "C" },
  { id: 3, name: "D" },
  { id: 4, name: "E" },
  { id: 5, name: "F" },
  { id: 6, name: "G" },

  { id: 7, name: "H" },
  { id: 8, name: "I" },
  { id: 9, name: "J" },
  { id: 10, name: "K" },
  { id: 11, name: "L" },
  { id: 12, name: "M" },
  { id: 13, name: "N" },

  { id: 14, name: "O" },
  { id: 15, name: "P" },
  { id: 16, name: "Q" },

  { id: 17, name: "R" },
  { id: 18, name: "S" },
  { id: 19, name: "T" },

  { id: 20, name: "U" },
  { id: 21, name: "V" },
  { id: 22, name: "W" },

  { id: 23, name: "X" },
  { id: 24, name: "Y" },
  { id: 25, name: "Z" },
]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    txt_tab_news: "赛事新闻",
    txt_tab_players: "选手资讯",
    image_path: resources.images_path,
    currTabID: 0,
    scroll_menu: [],
    currNewsMenuIdx: 0,
    curr_news_swiper_id: 0,
    currPlayersMenuIdx: 0,
    curr_player_swiper_id: 0,
    tag: [],
    currTagIdx: 0,
    news_post: [], // { id: 1, postId: 1, title: "哈哈哈", content: "<p></p>" , liked: true },
    players_post: [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
      { id: 6 },
      { id: 7 },
      { id: 8 }
    ],

    // 顶部tab相关参数
    head_top_num: 0,
    head_top: "0rpx",
    body_top: "0rpx",
    tab_opacity: 1,

    isBottom: false,
    isTop: false,
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
          windowHeight: windowHeight + "rpx"
        })
        console.log("window height: " + windowHeight) //最后获得转化后得rpx单位的窗口高度
      }
    })

    // 初始化选手资讯menu
    for (var i = 0; i < playersDefault.length; ++i) {
      playersMenu.add(playersDefault[i].id, playersDefault[i].name)
    }

    var success = res => {
      // menu
      var menus = res.data.menus
      for (var i = 0; i < newsDefault.length; ++i) {
        newsMenu.add(newsDefault[i].id, newsDefault[i].name)
      }
      for (var i = 0; i < menus.length; ++i) {
        newsMenu.add(menus[i].id, menus[i].name)
      }
      // tag
      var tags = res.data.tags
      for (var i = 0; i < tags.length; ++i) {
        tagsCtrl.addTag(tags[i].id, tags[i].name)
      }
      // 资讯
      var posts = res.data.posts
      for (var i = 0; i < posts.length; ++i) {
        posts[i].id = i
        posts[i].liked = false
        if (posts[i].likeCount == null) posts[i].likeCount = 0
        if (posts[i].viewCount == null) posts[i].viewCount = 0
        if (posts[i].memberName == null) posts[i].memberName = "网球帝小编"
      }

      that.setData({
        currTabID: 0,
        scroll_menu: newsMenu.getAll(),
        currNewsMenuIdx: 0,
        currPlayersMenuIdx: 0,
        tag: { tags: tagsCtrl.tags }, // 这样包起来用于模板使用
        currTagIdx: 0,
        news_post: posts
      })

      wx.hideLoading()
    }
    var fail = res => {
    }
    wx.showLoading({
      title: "加载中",
    })
    request.reqHomeInfo(null, success, fail)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { },

  /**
   * 点击赛事新闻
   */
  onNewsTabTap: function (e) {
    console.log("点击赛事新闻")
    if (this.data.currTabID == 0) return
    this.setData({
      currTabID: 0,
      scroll_menu: newsMenu.getAll(),
      currNewsMenuIdx: newsMenu.getChoosedID(),
      curr_news_swiper_id: newsMenu.getChoosedID()
    })
  },

  /**
   * 点击选手资讯
   */
  onPlayersTabTap: function (e) {
    console.log("点击选手资讯")
    if (this.data.currTabID == 1) return
    var that = this
    var success = (res) => {
      that.setData({
        currTabID: 1,
        scroll_menu: playersMenu.getAll(),
        currPlayersMenuIdx: playersMenu.getChoosedID(),
        curr_player_swiper_id: playersMenu.getChoosedID(),
      })
      wx.hideLoading()
    }
    var fail = (res) => {
    }
    wx.showLoading({
      title: "加载中",
    })
    request.reqPlayerInfo(success, fail)
  },

  /**
   * 用户点击菜单事件
   */
  onMenuItemTap: function (e) {
    console.log("用户点击menu")
    console.log(e)
    var tapID = e.currentTarget.dataset.index
    if (this.data.currTabID == 0) {
      if (this.data.currNewsMenuIdx == tapID) {
        return
      }
      newsMenu.setChoosedID(tapID)
      this.setData({
        scroll_menu: newsMenu.getAll(),
        currNewsMenuIdx: tapID,
        curr_news_swiper_id: tapID
      })
      
    } else if (this.data.currTabID == 1) {
      if (this.data.currPlayersMenuIdx == tapID) {
        return
      }
      playersMenu.setChoosedID(tapID)
      this.setData({
        scroll_menu: playersMenu.getAll(),
        currPlayersMenuIdx: tapID,
        curr_player_swiper_id: tapID
      })
    }
  },

  /**
   * 点击标签
   */
  onTagItemTap: function (e) {
    console.log("用户点击标签")
    console.log(e)
    var tapID = e.currentTarget.dataset.index
    if (this.data.currTagIdx == tapID) {
      return
    }
    var tags = this.data.tag.tags
    tags[this.data.currTagIdx].choosed = false
    tags[tapID].choosed = true
    this.setData({
      tag: { tags: tags },
      currTagIdx: tapID
    })
  },

  /**
   * 页面滑动框【触顶】事件
   */
  onBodyScrollYToUpper: function (e) {
    console.log("chuding")
    console.log(e);
    if (this.data.isTop) return

    this.setData({
      isTop: true
    })
    var that = this
    // setTimeout(function () {
    //   that.setData({
    //     isTop: false
    //   })
    // }, 2000)
  },

  /**
   * 页面滑动框【触底】事件
   */
  onBodyScrollYTolower: function (e) {
    console.log("竖向滑动触底")
    console.log(e)
    if (this.data.isBottom) return

    this.setData({
      isBottom: true
    })
    var that = this
    setTimeout(function () {
      that.setData({
        isBottom: false
      })
    }, 2000)
  },

  /**
   * 竖向【滑动】事件
   */
  onBodyScrollY: function (e) {
    // console.log(e)
    if (e.detail.scrollTop > 0) {
      var newTop = 0
      if (e.detail.deltaY > 0) {
        if (e.detail.deltaY > body_scroll_sudden) {
          // 突然上滑
          this.setData({
            head_top_num: 0,
            body_top: "0rpx",
            head_top: "0rpx",
            tab_opacity: 1
          })
        } else if (e.detail.scrollTop < top_offset && this.data.head_top_num < 0) {
          // 到顶端缓慢上滑
          newTop = -e.detail.scrollTop + e.detail.deltaY
          if (newTop < -top_offset) { newTop = -top_offset }
          if (newTop > 0) { newTop = 0 }

          var newOpacoty = 1 + newTop / head_alpha
          if (newOpacoty < 0) { newOpacoty = 0 }
          if (newOpacoty > 1) { newOpacoty = 1 }

          var newTopStr = String(newTop * SCREEN_CONVERT_RATIO) + "rpx"
          this.setData({
            head_top_num: newTop,
            body_top: newTopStr,
            head_top: newTopStr,
            tab_opacity: newOpacoty
          })
        }
      } else {
        // 下滑
        var newTop = this.data.head_top_num + e.detail.deltaY
        if (newTop < -top_offset) { newTop = -top_offset }
        if (newTop > 0) { newTop = 0 }

        var newOpacoty = 1 + newTop / head_alpha
        if (newOpacoty < 0) { newOpacoty = 0 }
        if (newOpacoty > 1) { newOpacoty = 1 }

        var newTopStr = String(newTop * SCREEN_CONVERT_RATIO) + "rpx"
        this.setData({
          head_top_num: newTop,
          body_top: newTopStr,
          head_top: newTopStr,
          tab_opacity: newOpacoty
        })
      }
    } else {
      if (this.data.isTop) {
        var absScrollTop = Math.abs(e.detail.scrollTop)
        // 触顶刷新
        var ballFill = 1 - absScrollTop / top_loading_threshold
        if (ballFill < 0) {
          if (!isVibrate){
            wx.vibrateShort()
            isVibrate = true
          }
          ballFill = 0
        }
        if (ballFill > 1) ballFill = 1
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
   * swiper current值改变事件函数，用户横向滑动
   */
  onSwiperChange: function (e) {
    console.log("用户横向滑动")
    console.log(e)
    var tapID = e.detail.current
    if (this.data.currTabID == 0) {
      if (this.data.currNewsMenuIdx == tapID) {
        return
      }
      newsMenu.setChoosedID(tapID)
      this.setData({
        scroll_menu: newsMenu.getAll(),
        currNewsMenuIdx: tapID,
        curr_news_swiper_id: tapID
      })
    } else if (this.data.currTabID == 1) {
      if (this.data.currPlayersMenuIdx == tapID) {
        return
      }
      playersMenu.setChoosedID(tapID)
      this.setData({
        scroll_menu: playersMenu.getAll(),
        currPlayersMenuIdx: tapID,
        curr_player_swiper_id: tapID
      })

    }
  },

  /**
   * 点击新闻item
   */
  onNewsItemTap: function (e) {
    console.log("点击赛事新闻中的item")
    console.log(e)
  },

  /**
   * 点击选手资讯item
   */
  onPlayerItemTap: function (e) {
    console.log("点击选手资讯中的选手")
    console.log(e)
    wx.navigateTo({
      url: "../playerNews/playerNews",
    })
  }
})