function menuCtrl() {
  this.menu = {}
  this.count = 0
  this.choosed = 0

  this.check = key => Boolean(this.menu[String(key)] != null)

  this.add = (id, menuData) => {
    const key = id
    var item = {}
    if (!this.check(key)) {
      item = {
        id: Number(id),
        name: menuData.name,
        weight: Number(menuData.weight)
      }
      ++this.count
      this.menu[String(key)] = item
    }
  }

  this.getAll = () => {
    var news_menu = []
    var index = 0
    for (var key in this.menu) {
      news_menu.push(this.menu[key])
      news_menu[index].choosed = (Number(key) == this.choosed)
      ++index
    }
    const sortFunc = (a, b) => {
      return Number(b.weight) - Number(a.weight)
    }
    news_menu.sort(sortFunc)
    for (var i = 0; i < news_menu.length; ++i) {
      news_menu[i].idx = i
    }
    this.setCacheDisplay(this.choosed)
    return news_menu
  }

  this.get = id => this.menu[id]

  this.remove = key => {
    if (this.check(key)) {
      this.menu[String(key)] = null
      --this.count
      if (Number(key) == this.choosed) this.choosed = 0
    }
  }

  this.clean = () => {
    this.count = 0
    this.choosed = 0
    this.menu = {}
  }

  this.getChoosed = () => this.choosed

  this.setChoosed = id => this.choosed = id

  this.getIdxById = () => this.menu[this.choosed].idx

  this.getIdByIdx = idx => {
    for (var id in this.menu) {
      if (this.menu[id].idx == idx) {
        return id
      }
    }
    return -1
  }

  this.setCacheDisplay = (currId) => {
    var currIdx = this.menu[currId].idx
    // 上一个
    var lastIdx = currIdx - 1
    if (lastIdx < 0) lastIdx = 0

    // 下一个
    var nextIdx = currIdx + 1
    if (nextIdx >= this.count) nextIdx = this.count - 1

    for (var key in this.menu) {
      if (this.menu[key].idx == lastIdx) this.menu[key].isShow = true
      else if (this.menu[key].idx == currIdx) this.menu[key].isShow = true
      else if (this.menu[key].idx == nextIdx) this.menu[key].isShow = true
      else this.menu[key].isShow = false
    }
  }

  this.setRed = (key, isRed) => {
    if (this.check(key)) {
      this.menu[key].red = isRed
    }
  }
}

module.exports = menuCtrl