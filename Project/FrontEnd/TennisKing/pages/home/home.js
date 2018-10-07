// pages/home/home.js

var menu_data = require("../../utils/menus.js")
var resources = require("../../utils/resources.js")

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

    image_path: resources.images_path
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

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
      scroll_menu: menu_data.news
    })
  },

  /**
   * 点击选手资讯
   */
  onTapPlayers: function (e) {
    console.log("点击选手资讯")
    this.setData({
      currTabID: 1,
      scroll_menu: menu_data.players
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
  }
})