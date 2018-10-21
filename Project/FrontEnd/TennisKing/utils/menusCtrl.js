const news_menu = [
  { idx: 0, id: -1, name: "全部", choosed: true }
]

const players_menu = [
  { idx: 0, id: 0, name: "A", choosed: true },
  { idx: 1, id: 1, name: "B", choosed: false },
  { idx: 2, id: 2, name: "C", choosed: false },
  { idx: 3, id: 3, name: "D", choosed: false },
  { idx: 4, id: 4, name: "E", choosed: false },
  { idx: 5, id: 5, name: "F", choosed: false },
  { idx: 6, id: 6, name: "G", choosed: false },

  { idx: 7, id: 7, name: "H", choosed: false },
  { idx: 8, id: 8, name: "I", choosed: false },
  { idx: 9, id: 9, name: "J", choosed: false },
  { idx: 10, id: 10, name: "K", choosed: false },
  { idx: 11, id: 11, name: "L", choosed: false },
  { idx: 12, id: 12, name: "M", choosed: false },
  { idx: 13, id: 13, name: "N", choosed: false },

  { idx: 14, id: 14, name: "O", choosed: false },
  { idx: 15, id: 15, name: "P", choosed: false },
  { idx: 16, id: 16, name: "Q", choosed: false },

  { idx: 17, id: 17, name: "R", choosed: false },
  { idx: 18, id: 18, name: "S", choosed: false },
  { idx: 19, id: 19, name: "T", choosed: false },

  { idx: 20, id: 20, name: "U", choosed: false },
  { idx: 21, id: 21, name: "V", choosed: false },
  { idx: 22, id: 22, name: "W", choosed: false },

  { idx: 23, id: 23, name: "X", choosed: false },
  { idx: 24, id: 24, name: "Y", choosed: false },
  { idx: 25, id: 25, name: "Z", choosed: false },
]

function addNewsMenu(menuID, menuName, choosed= false) {
  var newMenu = {
    idx: news_menu.length,
    id: Number(menuID),
    name: menuName,
    choosed: choosed
  }
  news_menu.push(newMenu)
}

module.exports = {
  news: news_menu,
  players: players_menu,
  addNewsMenu: addNewsMenu
};