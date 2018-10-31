function playerCtrl() {
  this.player = {}
  this.count = 0

  this.check = key => Boolean(this.player[String(key)] != null)

  this.add = (key, postData) => {
    if (!this.check(key)) {
      ++this.count
    }
    this.player[String(key)] = postData
  }

  this.getAll = () => {
    var players = []
    for (var key in this.player) {
      players.push(this.player[key])
    }
    return players
  }

  this.getPlayer = (initial) => {
    if (initial == null) {
      initial = "A"
    }
    var players = []
    for (var key in this.player) {
      var currPlayer = this.player[key]
      var isMatch = false
      if (currPlayer.letter == initial) {
        isMatch = true
      }

      if (isMatch) {
        players.push(currPlayer)
      }
    }
    return players
  }

  this.remove = key => {
    if (this.check(key)) {
      this.player[String(key)] = null
      --this.count
    }
  }

  this.clean = () => {
    this.count = 0
    this.player = {}
  }
}

module.exports = playerCtrl