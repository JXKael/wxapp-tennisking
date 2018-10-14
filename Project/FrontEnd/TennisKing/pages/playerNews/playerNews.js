// pages/playerNews/playerNews.js

var menu_data = require("../../utils/menus.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scroll_menu: [],
    tags: {
      tags: [
        { id: 1, name: "市场异动" },
        { id: 1, name: "伤病/退赛" },
        { id: 1, name: "打法对比" },
      ]
    },
    newsData: [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
      { id: 6 },
      { id: 7 },
      { id: 8 },
    ] // 临时数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      scroll_menu: menu_data.players
    })
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
    console.log("用户点击标签")
    console.log(e)
  }
})