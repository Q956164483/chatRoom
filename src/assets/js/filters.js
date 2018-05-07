/**
 *
 *
 * @export
 * @param {any} date
 */
export function formatDate (date) {
  if (!date) return ''
  const week = ['日', '一', '二', '三', '四', '五', '六']
  if (!(date instanceof Date)) date = new Date(date)
  let start = +date
  let day = 1000 * 60 * 60 * 24
  let now = +new Date()
  let dis = now - start
  if (dis < day) {
    return String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0')
  } else if (dis <= day * 2) {
    return '昨天'
  } else if (dis <= day * 7) {
    return '星期' + week[date.getDay()]
  } else {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  }
}

export default {
  formatDate
}
