// pages/home/home.js

var menu_data = require("../../utils/menus.js")
var resources = require("../../utils/resources.js")

var SCREEN_CONVERT_RATIO = 1
var touchStart = 0

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

    image_path: resources.images_path,

    isFixed: false,
    menu_scroll_left: 0,
    body_scroll_left: 0,
    curr_bodyScroll_ID: 0,
    body_scroll_into: "body-scroll0"
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

    this.setData({
      currTabID: 0,
      scroll_menu: menu_data.news
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
      currMenuID: tapID
    })
  },

  /**
   * 类目滑动事件
   */
  menuScroll: function (e) {
    // console.log(e)
    this.setData({
      menu_scroll_left: e.detail.scrollLeft
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
   * 页面【滑动】事件
   */
  pageScroll: function (e) {
    console.log(e)
    if (e.detail.scrollTop > 50){
      this.setData({
        isFixed: true,
      })
    }else{
      this.setData({
        isFixed: false,
      })
    }
  },

  /**
   * 主页内容左右滑动事件，自动贴近
   */
  bodyScroll: function (e) {
    // console.log(e)
    var re = e.detail.scrollLeft % 375
    var id = Math.ceil(e.detail.scrollLeft / 375)
    // if (re < 375 / 2){
    //   id -= 1
    //   if (id < 0 ){ id = 0 }
    //   this.setData({
    //     curr_bodyScroll_ID: id,
    //     body_scroll_into: "body-scroll" + id
    //   })
    // }else{
    //   this.setData({
    //     curr_bodyScroll_ID: id,
    //     body_scroll_into: "body-scroll" + id
    //   })
    // }
  },

  /**
   * 
   */
  bodyScrollTouchStart: function (e){
    console.log(e)
    touchStart = e.changedTouches[0].pageX
  },

  /**
   * 主页内容横向滑动手指抬起事件
   */
  bodyScrollTouchEnd: function (e){
    console.log(e)
    var touchEnd = e.changedTouches[0].pageX
    var id = this.data.curr_bodyScroll_ID
    id = touchStart > touchEnd ? id + 1 : id - 1
    var idMax = this.data.scroll_menu.length - 1
    if (id > idMax) id = idMax
    if (id < 0 ) id = 0
    this.setData({
      curr_bodyScroll_ID: id,
      body_scroll_into: "body-scroll" + id
    })

    // this.setData({
    //   // curr_bodyScroll_ID: id,
    //   body_scroll_into: "body-scroll" + this.data.curr_bodyScroll_ID
    // })
  }
})