function menuCtrl() {
  this.menu = {}
  this.count = 0
  this.choosedID = 0

  this.check = id => Boolean(this.menu[String(id)] != null)
  this.add = (id, menuName) => {
    var newMenu = {
      id: Number(id),
      name: menuName
    }
    if (!this.check(id)) ++this.count
    this.menu[String(id)] = newMenu
  }
  this.getAll = () => {
    var news_menu = []
    var index = 0
    for (var id in this.menu) {
      news_menu.push(this.menu[id])
      news_menu[index].idx = index
      news_menu[index].choosed = (Number(id) == this.choosedID)
      news_menu[index].isShow = false
      ++index
    }
    this.setChoosedID(this.choosedID)
    return news_menu
  }
  this.remove = id => {
    if (this.check(id)) {
      this.menu[String(id)] = null
      --this.count
      if (id == this.choosedID) this.choosedID = 0
    }
  }
  this.clean = () => {
    this.count = 0
    this.choosedID = 0
    this.menu = {}
  }
  this.getChoosedID = () => this.choosedID
  this.setChoosedID = id => {
    var currIdx = this.menu[this.choosedID].idx
    var lastID = id
    var lastIdx = currIdx - 1
    if (lastIdx < 0) lastIdx = 0
    var nextID = id
    var nextIdx = currIdx + 1
    if (nextIdx >= this.count) nextIdx = this.count - 1
    for (var menuID in this.menu) {
      if (this.menu[menuID].idx == lastIdx) {
        lastID = menuID
        break
      }
    }
    for (var menuID in this.menu) {
      if (this.menu[menuID].idx == nextIdx) {
        nextID = menuID
        break
      }
    }
    this.menu[String(lastID)].isShow = true
    this.menu[String(id)].isShow = true
    this.menu[String(nextID)].isShow = true
    this.choosedID = id
  }
}

module.exports = menuCtrl