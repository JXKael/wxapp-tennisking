/**
 * 判断目标是否是函数
 * @param {mixed} val
 * @returns {boolean}
 */
const isFunction = val => {
  return typeof val === 'function';
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  // return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  const result = {
    year: year,
    month: month,
    day: day,
    hour: hour,
    minute: minute,
    second: second
  }

  return result
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  isFunction: isFunction
}
