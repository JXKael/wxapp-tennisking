// pages/home/home.js
const resources = require("../../utils/resources.js")
const menusCtrl = require("../../utils/menuCtrl.js")
const postsCtrl = require("../../utils/postCtrl.js")
const playersCtrl = require("../../utils/playerCtrl.js")
const request = require('../../utils/request.js');
const util = require('../../utils/util.js')

var SCREEN_CONVERT_RATIO = 1
var isScrolling = false
const top_offset = 60
const head_alpha = 32
const body_scroll_sudden = 50
const top_loading_threshold = 80
var needNewPost = false
const newsMenuCtrl = new menusCtrl()
const playersMenuCtrl = new menusCtrl()
const tagCtrl = new menusCtrl()
const newsPostCtrl = new postsCtrl()
const playersPostCtrl = new playersCtrl()
var isTapMenuOnly = false // 点击菜单会调用swiper current change事件，重复设置data，用此变量控制

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

const tagsDefault = [
  { id: 0, name: "全部"}
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
    players_post: [], // {idx: 1, playerId: "1", playerName: "", postNum: 0, letter: "" }

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
      playersMenuCtrl.add(playersDefault[i].id, playersDefault[i].name)
    }

    this.reqHomeInfo(null, null, null)
  },

  reqHomeInfo: function (postId, menuId, playerId) {
    var that = this
    var success = res => {
      // menu
      for (var i = 0; i < newsDefault.length; ++i) {
        newsMenuCtrl.add(newsDefault[i].id, newsDefault[i].name)
      }
      var menus_res = res.data.menus
      for (var i = 0; i < menus_res.length; ++i) {
        newsMenuCtrl.add(menus_res[i].id, menus_res[i].name)
      }
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
        posts_res[i].id = i
        var date = util.formatTime(new Date(posts_res[i].createTime * 1000))
        posts_res[i].time = date.month + "/" + date.day + "\n" + date.hour + ":" + date.minute
        newsPostCtrl.add(posts_res[i].postId, posts_res[i])
        // posts[i].liked = false
      }
      var choosedMenuId = newsMenuCtrl.getChoosed()
      newsMenuCtrl.setChoosed(choosedMenuId)
      var choosedIdx = newsMenuCtrl.getIdxById(choosedMenuId)
      var newsMenu = newsMenuCtrl.getAll()

      var choosedTagId = tagCtrl.getChoosed()
      var tagsMenu = tagCtrl.getAll()

      var posts = newsPostCtrl.getPost(choosedMenuId, choosedTagId, playerId)
      that.setData({
        currTabID: 0,
        scroll_menu: newsMenu,
        currNewsMenuIdx: choosedIdx,
        curr_news_swiper_id: choosedIdx,
        tag: { tags: tagsMenu }, // 这样包起来用于模板使用
        currTagIdx: 0,
        news_post: posts
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

    var newsMenu = newsMenuCtrl.getAll()
    var choosedMenuId = newsMenuCtrl.getChoosed()
    var choosedIdx = newsMenuCtrl.getIdxById(choosedMenuId)
    this.setData({
      currTabID: 0,
      scroll_menu: newsMenu,
      currNewsMenuIdx: choosedIdx,
      curr_news_swiper_id: choosedIdx
    })
  },

  /**
   * 点击选手资讯
   */
  onPlayersTabTap: function (e) {
    console.log("点击选手资讯")
    if (this.data.currTabID == 1) return
    this.reqPlayerInfo()
  },

  reqPlayerInfo: function () {
    var that = this
    var success = (res) => {
      var posts_res = res.data.players
      for (var i = 0; i < posts_res.length; ++i){
        posts_res[i].idx = i
        playersPostCtrl.add(posts_res[i].playerId, posts_res[i])
      }
      var choosedMenuId = playersMenuCtrl.getChoosed()
      playersMenuCtrl.setChoosed(choosedMenuId)
      var choosedIdx = playersMenuCtrl.getIdxById()
      var playersMenu = playersMenuCtrl.getAll()
      var players = playersPostCtrl.getPlayer(playersMenuCtrl.get(choosedMenuId).name)
      that.setData({
        currTabID: 1,
        scroll_menu: playersMenu,
        currPlayersMenuIdx: choosedIdx,
        curr_player_swiper_id: choosedIdx,
        players_post: players
      })
      wx.hideLoading()
    }
    var fail = (res) => {
      wx.hideLoading()
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
    console.log("用户点击 menu, id: " + e.currentTarget.dataset.id + ", idx: " + e.currentTarget.dataset.idx)
    // console.log(e)

    var tapId = e.currentTarget.dataset.id
    var tapIdx = e.currentTarget.dataset.idx
    if (this.data.currTabID == 0) {
      if (this.data.currNewsMenuIdx == tapIdx) {
        return
      }
      newsMenuCtrl.setChoosed(tapId)
      tagCtrl.clean()
      if (tapId == 0) tapId = null
      this.reqHomeInfo(null, tapId, null)
    } else if (this.data.currTabID == 1) {
      if (this.data.currPlayersMenuIdx == tapIdx) {
        return
      }
      playersMenuCtrl.setChoosed(tapId)
      var playersMenu = playersMenuCtrl.getAll()
      var players = playersPostCtrl.getPlayer(playersMenuCtrl.get(tapId).name)
      this.setData({
        scroll_menu: playersMenu,
        currPlayersMenuIdx: tapIdx,
        curr_player_swiper_id: tapIdx,
        players_post: players
      })
    }

    isTapMenuOnly = true
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
    var currMenuId = newsMenuCtrl.getChoosed()
    var posts = newsPostCtrl.getPost(currMenuId, tapId, null)
    this.setData({
      tag: { tags: tagsMenu },
      currTagIdx: tapIdx,
      news_post: posts
    })
  },

  /**
   * swiper current值改变事件函数，用户横向滑动
   */
  onSwiperChange: function (e) {
    if (isTapMenuOnly) {
      isTapMenuOnly = false
      return
    }
    console.log("用户横向滑动至idx: " + e.detail.current)
    // console.log(e)
    var tapIdx = e.detail.current
    if (this.data.currTabID == 0) {
      if (this.data.currNewsMenuIdx == tapIdx) {
        return
      }
      var tapId = newsMenuCtrl.getIdByIdx(tapIdx)
      newsMenuCtrl.setChoosed(tapId)
      tagCtrl.clean()
      if (tapId == 0) tapId = null
      this.reqHomeInfo(null, tapId, null)
    } else if (this.data.currTabID == 1) {
      if (this.data.currPlayersMenuIdx == tapIdx) {
        return
      }
      var tapId = playersMenuCtrl.getIdByIdx(tapIdx)
      playersMenuCtrl.setChoosed(tapId)
      var playersMenu = playersMenuCtrl.getAll()
      var players = playersPostCtrl.getPlayer(playersMenuCtrl.get(tapId).name)
      this.setData({
        scroll_menu: playersMenu,
        currPlayersMenuIdx: tapIdx,
        curr_player_swiper_id: tapIdx,
        players_post: players
      })
    }
  },

  /**
   * 页面滑动框【触顶】事件
   */
  onBodyScrollYToUpper: function (e) {
    console.log("触顶事件")
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
      isScrolling = true
      var newTop = 0
      if (e.detail.deltaY > 0) {
        if (e.detail.deltaY > body_scroll_sudden) {
          // 突然上滚
          this.setData({
            head_top_num: 0,
            body_top: "0rpx",
            head_top: "0rpx",
            tab_opacity: 1
          })
        } else if (e.detail.scrollTop < top_offset && this.data.head_top_num < 0) {
          // 到顶端缓慢上滚
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
        // 下滚
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
          if (!needNewPost) needNewPost = true;
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
   * 
   */
  onBodyTouchEnd: function (e) {
    // console.log("触摸结束")
    // if (isScrolling) {
    //   if (Math.abs(this.data.head_top_num) < top_offset / 2) {
    //     // 下弹回来
    //     // var newTop = this.data.head_top_num + 
    //     // if (newTop < -top_offset) { newTop = -top_offset }
    //     // if (newTop > 0) { newTop = 0 }

    //     // var newOpacoty = 1 + newTop / head_alpha
    //     // if (newOpacoty < 0) { newOpacoty = 0 }
    //     // if (newOpacoty > 1) { newOpacoty = 1 }

    //     // var newTopStr = String(newTop * SCREEN_CONVERT_RATIO) + "rpx"
    //     // this.setData({
    //     //   head_top_num: newTop,
    //     //   body_top: newTopStr,
    //     //   head_top: newTopStr,
    //     //   tab_opacity: newOpacoty
    //     // })
    //   }else{
    //     // 上缩回去
    //   }
    //   isScrolling = false
    // }

    // if (this.data.isTop) {
    //   if (needNewPost) {
    //     this.reqHomeInfo()
    //   }
    //   needNewPost = false
    // }
  },

  /**
   * 点击新闻item
   */
  onNewsItemTap: function (e) {
    console.log("点击赛事新闻中的item")
    console.log(e)
    wx.navigateTo({
      url: "../detail/detail",
    })
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