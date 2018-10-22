function menuCtrl() {
  this.menu = {}
  this.news_count = 0
  this.choosedID = 0

  this.check = id => Boolean(this.menu[String(id)] != null)
  this.add = (id, menuName) => {
    var newMenu = {
      id: Number(id),
      name: menuName
    }
    if (!this.check(id)) ++this.news_count
    this.menu[String(id)] = newMenu
  }
  this.getAll = () => {
    var news_menu = []
    var index = 0
    for (var id in this.menu) {
      news_menu.push(this.menu[id])
      news_menu[index].idx = index
      news_menu[index].choosed = (Number(id) == this.choosedID)
      ++index
    }
    return news_menu
  }
  this.remove = id => {
    if (this.check(id)) {
      this.menu[String(id)] = null
      --this.news_count
      if (id == this.choosedID) this.choosedID = 0
    }
  }
  this.clean = () => {
    this.news_count = 0
    this.choosedID = 0
    this.menu = {}
  }
  this.getChoosedID = () => this.choosedID
  this.setChoosedID = id => { this.choosedID = id }
}

module.exports = menuCtrl