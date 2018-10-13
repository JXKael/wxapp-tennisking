// pages/home/home.js

var menu_data = require("../../utils/menus.js")
var resources = require("../../utils/resources.js")

var SCREEN_CONVERT_RATIO = 1
var top_offset = 60
var head_alpha = 32
var body_scroll_sudden = 40

Page({

  /**
   * 页面的初始数据
   */
  data: {
    txt_tab_news: "赛事新闻",
    txt_tab_players: "选手资讯",
    currTabID: 0,
    scroll_menu: [],
    currMenuID: 0,
    newsData: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], // 临时数据

    image_path: resources.images_path,

    curr_news_swiper_id: 0,
    curr_player_swiper_id: 0,
    // body_scroll_into: "body-scroll0",
    // 顶部tab相关参数
    head_top_num: 0,
    head_top: "0rpx",
    body_top: "0rpx",
    tab_opacity: 1
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

    // this.setData({
    //   currTabID: 0,
    //   scroll_menu: menu_data.news
    // })

    this.setData({
      currTabID: 1,
      scroll_menu: menu_data.players
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  /**
   * 点击赛事新闻
   */
  onTapNews: function (e) {
    console.log("点击赛事新闻")
    this.setData({
      currTabID: 0,
      scroll_menu: menu_data.news,
      currMenuID: 0
    })
  },

  /**
   * 点击选手资讯
   */
  onTapPlayers: function (e) {
    console.log("点击选手资讯")
    this.setData({
      currTabID: 1,
      scroll_menu: menu_data.players,
      currMenuID: 0
    })
  },

  /**
   * 用户点击菜单事件
   */
  onTapMenuItem: function (e) {
    console.log("用户点击类目")
    console.log(e)
    var tapID = e.currentTarget.dataset.index
    var menu = this.data.scroll_menu
    menu[this.data.currMenuID].choosed = false
    menu[tapID].choosed = true
    this.setData({
      scroll_menu: menu,
      currMenuID: tapID,
      curr_news_swiper_id: tapID,
      curr_player_swiper_id: tapID
    })
  },

  /**
   * 页面滑动框【触顶】事件
   */
  pageScrollToupper: function (e) {
    // console.log(e);
  },

  /**
   * 页面滑动框【触底】事件
   */
  pageScrollTolower: function (e) {
    // console.log(e)
  },

  /**
   * 竖向【滑动】事件
   */
  onBodyScrollY: function (e) {
    // console.log(e)
    if (e.detail.scrollTop < 0){ return }

    var newTop = 0
    if (e.detail.deltaY > 0) {
      if (e.detail.deltaY > body_scroll_sudden) {
        this.setData({
          head_top_num: 0,
          body_top: "0rpx",
          head_top: "0rpx",
          tab_opacity: 1
        })
      } else if (e.detail.scrollTop < top_offset && this.data.head_top_num < 0) {
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
  },

  /**
   * 赛事新闻swiper current值改变事件函数
   */
  onNewsSwiperChange: function(e) {
    console.log("用户横向滑动")
    console.log(e)
    var tapID = e.detail.current
    var menu = this.data.scroll_menu
    menu[this.data.currMenuID].choosed = false
    menu[tapID].choosed = true
    this.setData({
      scroll_menu: menu,
      currMenuID: tapID,
      curr_news_swiper_id: tapID
    })
  },

  /**
   * 选手资讯swiper current值改变事件函数
   */
  onPlayerSwiperChange: function (e) {
    console.log("用户横向滑动")
    console.log(e)
    var tapID = e.detail.current
    var menu = this.data.scroll_menu
    menu[this.data.currMenuID].choosed = false
    menu[tapID].choosed = true
    this.setData({
      scroll_menu: menu,
      currMenuID: tapID,
      curr_player_swiper_id: tapID
    })
  }
})