export default function (timeStamp): string {
  let yearMonthDay = timeStamp.split('-')
  let time = yearMonthDay[2].split('T')
  yearMonthDay = [yearMonthDay[0], yearMonthDay[1], time[0]]
  time = time[1].split(':')
  if (yearMonthDay[1] < 10) {
    yearMonthDay[1] = yearMonthDay[1] % 10
  }
  if (yearMonthDay[2] < 10) {
    yearMonthDay[2] = yearMonthDay[2] % 10
  }
  const date = new Date()

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  if (yearMonthDay[1] !== Number(month) || yearMonthDay[2] !== Number(day) - 1) {
    return `${yearMonthDay[1]}월 ${yearMonthDay[2]}일`
  }
  if (yearMonthDay[0] !== year) {
    return `${yearMonthDay[0]}. ${yearMonthDay[1]}. ${yearMonthDay[2]}`
  }
  if (yearMonthDay[1] === Number(month) && yearMonthDay[2] === Number(day) - 1) {
    return '어제'
  }
  if (yearMonthDay[1] === Number(month) && yearMonthDay[2] === Number(day)) {
    return `${time[0]}시 ${time[1]}분`
  }
  return '분류되지 않음...'
}
