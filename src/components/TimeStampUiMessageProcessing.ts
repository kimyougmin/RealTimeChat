export default function (timeStamp): string {
  let time = timeStamp.split('T')
  time = time[1].split(':')
  return `${time[0]}:${time[1]}`
}
