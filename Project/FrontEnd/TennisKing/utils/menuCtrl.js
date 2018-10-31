function menuCtrl() {
  this.menu = {}
  this.count = 0
  this.choosed = 0

  this.check = key => Boolean(this.menu[String(key)] != null)

  this.add = (id, menuName) => {
    const key = id
    var item = {}
    if (!this.check(key)) {
      item = {
        id: Number(id),
        name: menuName,
        idx: this.count
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

  this.setChoosed = id => {
    this.setCacheDisplay(this.choosed, false)
    this.choosed = id
    this.setCacheDisplay(this.choosed, true)
  }

  this.getIdxById = () => this.menu[this.choosed].idx

  this.getIdByIdx = idx => {
    for (var id in this.menu) {
      if (this.menu[id].idx == idx) {
        return id
      }
    }
  }

  this.setCacheDisplay = (currId, isDisplay) =>{
    var currIdx = this.menu[currId].idx
    // 上一个
    var lastIdx = currIdx - 1
    if (lastIdx < 0) lastIdx = 0
    var lastID = this.getIdByIdx(lastIdx)
    // 下一个
    var nextIdx = currIdx + 1
    if (nextIdx >= this.count) nextIdx = this.count - 1
    var nextID = this.getIdByIdx(nextIdx)
    // 设置显示
    this.menu[String(lastID)].isShow = isDisplay
    this.menu[String(currId)].isShow = isDisplay
    this.menu[String(nextID)].isShow = isDisplay
  }
}

module.exports = menuCtrl