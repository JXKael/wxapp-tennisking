const util = require('util.js')

const polish = (aPost) => {
    // 默认作者
    if (aPost.memberName == null) aPost.memberName = "网球帝小编"
    aPost.isHomeTop = Number(aPost.top) == 1
    aPost.isMenuTop = Number(aPost.top) == 2
    // 数字处理
    if (aPost.forwardCount == null) aPost.forwardCount = 0
    if (aPost.viewCount == null) aPost.viewCount = 0
    if (aPost.likeCount == null) aPost.likeCount = 0
    // 设置时间
    var date = util.formatTime(new Date(aPost.createTime * 1000))
    var month = date.month >= 10 ? date.month : "0" + date.month
    var day = date.day >= 10 ? date.day : "0" + date.day
    var hour = date.hour >= 10 ? date.hour : "0" + date.hour
    var minute = date.minute >= 10 ? date.minute : "0" + date.minute
    aPost.date = date
    // 置顶处理
    if (aPost.isHomeTop || aPost.isMenuTop) {
      aPost.timeTop = month + "/" + day + "\n" + "置顶"
    }
    aPost.time = month + "/" + day + "\n" + hour + ":" + minute
    // 清除所有格式
    // aPost.content = aPost.content.replace(/<([a-zA-Z]+)\s*[^><]*>/g, "<$1>")
    // 图片添加域名
    aPost.content = aPost.content.replace("src=\"", "src=\"https://wangqiudi.com")
    // aPost.content = aPost.content.replace(/<p(><\/p><p)*>/, "<p><span style='color:black'><b>" + aPost.title  + "</b> </span>")
    // 是否需要折叠
    aPost.canFold = aPost.summary.length >= 70
}

function postCtrl() {
  this.post = {}
  this.count = 0

  this.check = key => Boolean(this.post[String(key)] != null)

  this.add = (key, postData) => {
    if (!this.check(key)) {
      ++this.count
    }
    this.post[String(key)] = postData
  }

  this.getAll = () => {
    var posts = []
    for (var key in this.post) {
      posts.push(this.post[key])
    }
    return posts
  }

  this.getPost = (menuId, tagId, playerId, isTopActive) => {
    menuId = menuId != null ? Number(menuId) : 0
    tagId = tagId != null ? Number(tagId) : 0
    playerId = playerId != null ? Number(playerId) : 0
    isTopActive = isTopActive != null ? isTopActive : true
    var posts = []
    for (var key in this.post) {
      var currPost = this.post[key]
      var isMenuMatch = false
      var isTagMatch = false
      var isPlayerMatch = false
      // 匹配menu
      if (menuId > 0) {
        if (Number(currPost.menuId) == menuId) {
          isMenuMatch = true
        }
      } else {
        isMenuMatch = true
      }
      // 匹配tag
      if (tagId > 0) {
        var tags = currPost.tags
        for (var i = 0; i < tags.length; ++i) {
          if (Number(tags[i].tagId) == tagId ){
            isTagMatch = true
            break
          }
        }
      } else {
        isTagMatch = true
      }
      // 匹配选手
      if (playerId > 0) {
        isPlayerMatch = true
      } else {
        isPlayerMatch = true
      }
      if (isMenuMatch && isTagMatch && isPlayerMatch) {
        currPost.isFold = true
        currPost.isTopActive = isTopActive
        currPost.isShowMenu = menuId == 0
        currPost.isTop = menuId != 0 ? (currPost.isHomeTop || currPost.isMenuTop) : currPost.isHomeTop
        posts.push(currPost)
      }
    }
    var sortFunc = (a, b) => {
      if (isTopActive) {
        if (a.isTop && !b.isTop) return -1
        if (b.isTop && !a.isTop) return 1
      }
      return Number(b.createTime) - Number(a.createTime)
    }
    posts.sort(sortFunc)
    for (var i = 0; i < posts.length; ++i) {
      posts[i].idx = i
    }
    return posts
  }

  this.remove = key => {
    if (this.check(key)) {
      this.post[String(key)] = null
      --this.count
    }
  }

  this.clean = () => {
    this.count = 0
    this.post = {}
  }

  this.polishPost = (aPost) => {
    polish(aPost)
    // 选手姓名
    var flexTitle = ""
    var playerName = ""
    var shortName = ""
    if (aPost.playerId != null) {
      if (aPost.players != null && aPost.players.length > 0) {
        var gotName = false
        for (var i = 0; i < aPost.players.length; ++i) {
          if (Number(aPost.playerId) == Number(aPost.players[i].playerId)) {
            gotName = true
            if (aPost.players[i].shortName != null ) {
              flexTitle = aPost.players[i].shortName
              playerName = aPost.players[i].playerName
              shortName = aPost.players[i].shortName
            } else {
              flexTitle = aPost.players[i].playerName
              playerName = aPost.players[i].playerName
              shortName = aPost.players[i].shortName
            }
            break
          }
        }
        // 列表中没找到
        if (!gotName) {
          flexTitle = aPost.title
        }
      } else {
        flexTitle = aPost.title
      }
    } else {
      if (aPost.players != null && aPost.players.length > 0) {
        if (aPost.players[0].shortName != null) {
          flexTitle = aPost.players[0].shortName
          playerName = aPost.players[0].playerName
          shortName = aPost.players[0].shortName
        } else {
          flexTitle = aPost.players[0].playerName
          playerName = aPost.players[0].playerName
          shortName = aPost.players[0].shortName
        }
        aPost.playerId = aPost.players[0].playerId
      } else {
        flexTitle = aPost.title
      }
    }
    aPost.flexTitle = flexTitle
    aPost.playerName = playerName
    aPost.shortName = shortName
    // 单个选手资讯界面与资讯界面显示不同
    aPost.isPlayerNews = false
    // 前面插入标题
    aPost.content = "<p style='color:black'><b>" + aPost.title + "</b></p>" + aPost.content
  }

  this.polishPostForPlayer = (aPost, playerName) => {
    polish(aPost)
    // 主页显示名字处，显示标题
    aPost.flexTitle = aPost.title
    aPost.playerName = playerName
    // 单个选手资讯界面与资讯界面显示不同
    aPost.isPlayerNews = true
  }
}

module.exports = postCtrl