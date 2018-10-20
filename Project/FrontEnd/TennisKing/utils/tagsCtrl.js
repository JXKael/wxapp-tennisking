const tagList = [
  { idx: 0, id: -1, name: "全部", choosed: true }
]

function addTag (tagID, tagName, choosed = false) {
  var newTag = {
    idx: tagList.length,
    id: Number(tagID),
    name: tagName,
    choosed: choosed
  }
  tagList.push(newTag)
}

module.exports = {
  // data
  tags: tagList,
  // func
  addTag: addTag,
};