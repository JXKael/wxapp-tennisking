const util = require('util.js')

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
        posts.push(currPost)
      }
    }
    var sortFunc = (a, b) => {
      if (isTopActive) {
        if (a.isTop) return false
        if (b.isTop) return true
      }
      return Number(b.postId) - Number(a.postId)
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
    // 默认作者
    if (aPost.memberName == null) aPost.memberName = "网球帝小编"
    aPost.isTop = Number(aPost.top) == 1
    // 设置时间
    var date = util.formatTime(new Date(aPost.createTime * 1000))
    var month = date.month >= 10 ? date.month : "0" + date.month
    var day = date.day >= 10 ? date.day : "0" + date.day
    var hour = date.hour >= 10 ? date.hour : "0" + date.hour
    var minute = date.minute >= 10 ? date.minute : "0" + date.minute
    aPost.date = date
    // 置顶
    if (aPost.isTop) {
      aPost.timeTop = month + "/" + day + "\n" + "置顶"
    }
    aPost.time = month + "/" + day + "\n" + hour + ":" + minute
    // 选手姓名
    var playerNames = ""
    if (aPost.playerId != null) {
      if (aPost.players != null && aPost.players.length > 0) {
        var gotName = false
        for (var i = 0; i < aPost.players.length; ++i) {
          if (Number(aPost.playerId) == Number(aPost.players[i].playerId)) {
            playerNames = aPost.players[i].playerName
            gotName = true
          }
        }
        // 列表中没找到
        if (!gotName) {
          playerNames = aPost.title
        }
      } else {
        playerNames = aPost.title
      }
    } else {
      if (aPost.players != null && aPost.players.length > 0) {
        playerNames = aPost.players[0].playerName
        aPost.playerId = aPost.players[0].playerId
      } else {
        playerNames = aPost.title
      }
    }
    aPost.playerNames = playerNames
    // 清除所有格式
    aPost.content = aPost.content.replace(/<([a-zA-Z]+)\s*[^><]*>/g, "<$1>")
    // 前面插入标题
    aPost.content = "<p style='color:black'><b>" + aPost.title + "</b></p>" + aPost.content
    // 是否需要折叠
    aPost.canFold = aPost.summary.length >= 70
    // aPost.content = aPost.content.replace(/<p(><\/p><p)*>/, "<p><span style='color:black'><b>" + aPost.title  + "</b> </span>")
  }
}

module.exports = postCtrl