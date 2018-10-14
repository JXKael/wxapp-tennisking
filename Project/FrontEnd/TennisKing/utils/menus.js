const news_menu = [
  {
    id: 0, name: "全部比赛", choosed: true,
    tags: [
      { id: 1, name: "市场异动" },
      { id: 1, name: "伤病/退赛" },
      { id: 1, name: "打法对比" },
    ]
  },
  {
    id: 1, name: "ATP", choosed: false,
    tags: [
      { id: 1, name: "市场异动" },
      { id: 1, name: "伤病/退赛" },
    ]
  },
  {
    id: 2, name: "WTA", choosed: false,
    tags: [
      { id: 1, name: "市场异动" },
      { id: 1, name: "打法对比" },
    ]
  },
  {
    id: 3, name: "ITF", choosed: false,
    tags: [
      { id: 1, name: "市场异动" },
      { id: 1, name: "伤病/退赛" },
      { id: 1, name: "打法对比" },
    ]
  },
  {
    id: 4, name: "澳网", choosed: false,
    tags: [
    ]
  },
  {
    id: 5, name: "法网", choosed: false,
    tags: [
      { id: 1, name: "市场异动" },
      { id: 1, name: "伤病/退赛" },
      { id: 1, name: "打法对比" },
    ]
  },
  {
    id: 6, name: "温网", choosed: false,
    tags: [
      { id: 1, name: "市场异动" },
      { id: 1, name: "伤病/退赛" },
    ]
  },
  {
    id: 7, name: "美网", choosed: false,
    tags: [
      { id: 1, name: "市场异动" },
    ]
  },
]

const players_menu = [
  { id: 0, name: "A", choosed: true },
  { id: 1, name: "B", choosed: false },
  { id: 2, name: "C", choosed: false },
  { id: 3, name: "D", choosed: false },
  { id: 4, name: "E", choosed: false },
  { id: 5, name: "F", choosed: false },
  { id: 6, name: "G", choosed: false },

  { id: 7, name: "H", choosed: false },
  { id: 8, name: "I", choosed: false },
  { id: 9, name: "J", choosed: false },
  { id: 10, name: "K", choosed: false },
  { id: 11, name: "L", choosed: false },
  { id: 12, name: "M", choosed: false },
  { id: 13, name: "N", choosed: false },

  { id: 14, name: "O", choosed: false },
  { id: 15, name: "P", choosed: false },
  { id: 16, name: "Q", choosed: false },

  { id: 17, name: "R", choosed: false },
  { id: 18, name: "S", choosed: false },
  { id: 19, name: "T", choosed: false },

  { id: 20, name: "U", choosed: false },
  { id: 21, name: "V", choosed: false },
  { id: 22, name: "W", choosed: false },

  { id: 23, name: "X", choosed: false },
  { id: 24, name: "Y", choosed: false },
  { id: 25, name: "Z", choosed: false },
]

module.exports = {
  news: news_menu,
  players: players_menu
};