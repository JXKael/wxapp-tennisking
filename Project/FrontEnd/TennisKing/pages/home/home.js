// pages/home/home.js

var menusCtrl = require("../../utils/menusCtrl.js")
var tagsCtrl = require("../../utils/tagsCtrl.js")
var resources = require("../../utils/resources.js")
var request = require('../../utils/request.js');

var SCREEN_CONVERT_RATIO = 1
var top_offset = 60
var head_alpha = 32
var body_scroll_sudden = 50

Page({

  /**
   * 页面的初始数据
   */
  data: {
    txt_tab_news: "赛事新闻",
    txt_tab_players: "选手资讯",
    currTabID: 0,
    scroll_menu: [],
    currNewsMenuIdx: 0,
    currPlayersMenuIdx: 0,
    tag: [],
    currTagIdx: 0,
    news_post: [], // { id: 1, postId: 1, title: "哈哈哈", content: "<p></p>" , liked: true },

    image_path: resources.images_path,

    curr_news_swiper_id: 0,
    curr_player_swiper_id: 0,
    // body_scroll_into: "body-scroll0",
    // 顶部tab相关参数
    head_top_num: 0,
    head_top: "0rpx",
    body_top: "0rpx",
    tab_opacity: 1,

    isBottom: false
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

    var that = this
    var successCallback = res => {
      console.log("成功")
      console.log(res)
      // menu
      var menus = res.data.menus
      for (var i = 0; i < menus.length; ++i) {
        menusCtrl.addNewsMenu(menus[i].id, menus[i].name)
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
        scroll_menu: menusCtrl.news,
        currNewsMenuIdx: 0,
        currPlayersMenuIdx: 0,
        tag: { tags: tagsCtrl.tags }, // 这样包起来用于模板使用
        currTagIdx: 0,
        news_post: posts
      })
    }
    var failCallback = res => {
      console.log(res)
    }
    request.reqHomeInfo(successCallback, failCallback)
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
  onNewsTabTap: function (e) {
    console.log("点击赛事新闻")
    this.setData({
      currTabID: 0,
      scroll_menu: menusCtrl.news,
      currNewsMenuIdx: 0
    })
  },

  /**
   * 点击选手资讯
   */
  onPlayersTabTap: function (e) {
    console.log("点击选手资讯")
    wx.request({
      url: "http://39.104.201.188/index/player/",
      method: "GET",
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      }
    })
    this.setData({
      currTabID: 1,
      scroll_menu: menusCtrl.players,
      currPlayersMenuIdx: 0
    })
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
      var menu = this.data.scroll_menu
      menu[this.data.currNewsMenuIdx].choosed = false
      menu[tapID].choosed = true
      this.setData({
        scroll_menu: menu,
        currNewsMenuIdx: tapID,
        curr_news_swiper_id: tapID
      })
    }else if (this.data.currTabID == 1) {
      if (this.data.currPlayersMenuIdx == tapID) {
        return
      }
      var menu = this.data.scroll_menu
      menu[this.data.currPlayersMenuIdx].choosed = false
      menu[tapID].choosed = true
      this.setData({
        scroll_menu: menu,
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
  pageScrollToupper: function (e) {
    // console.log(e);
  },

  /**
   * 页面滑动框【触底】事件
   */
  onBodyScrollYTolower: function (e) {
    console.log("竖向滑动触底")
    console.log(e)
    this.setData({
      isBottom: true
    })
    var that = this
    setTimeout(function(){
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
    if (e.detail.scrollTop < 0){ return }

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
  },

  /**
   * swiper current值改变事件函数
   */
  onSwiperChange: function(e) {
    console.log("用户横向滑动")
    console.log(e)
    var tapID = e.detail.current
    if (this.data.currTabID == 0) {
      if (this.data.currNewsMenuIdx == tapID) {
        return
      }
      var menu = this.data.scroll_menu
      menu[this.data.currNewsMenuIdx].choosed = false
      menu[tapID].choosed = true
      this.setData({
        scroll_menu: menu,
        currNewsMenuIdx: tapID,
        curr_news_swiper_id: tapID
      })
    } else if (this.data.currTabID == 1) {
      if (this.data.currPlayersMenuIdx == tapID) {
        return
      }
      var menu = this.data.scroll_menu
      menu[this.data.currPlayersMenuIdx].choosed = false
      menu[tapID].choosed = true
      this.setData({
        scroll_menu: menu,
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