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

  this.getPost = (menuId, tagId, playerId) => {
    menuId = menuId != null ? Number(menuId) : 0
    tagId = tagId != null ? Number(tagId) : 0
    playerId = playerId != null ? Number(playerId) : 0
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
        posts.push(currPost)
      }
    }
    var sortFunc = (a, b) => Number(b.postId) - Number(a.postId)
    posts.sort(sortFunc)
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
}

module.exports = postCtrl