const REGEX_FORMAT = /YYYY|M|D|dddd|HH|mm/g
const MS_A_DAY = 24 * 60 * 60 * 1000
const MS_A_WEEK = MS_A_DAY * 7

export type IDate = number | string | Date

type DateFormats = {
  [p: string]: string
}

interface TimeLocale {
  weekdays: string[]
  formats: DateFormats
}

const parseDate = (date: IDate) => {
  if (date instanceof Date) {
    return date
  }
  return new Date(date)
}

const getWeeHours = () => new Date(new Date().setHours(0, 0, 0, 0))

const padStart = (n: number) => n.toString().padStart(2, '0')

const getFormat = (date: Date) => {
  const diff = getWeeHours().getTime() - date.getTime()
  console.log(diff)
  if (diff < 0) {
    return 'LT' // 今天
  } else if (diff < MS_A_DAY) {
    return 'YT' // 昨天
  } else if (diff < MS_A_WEEK) {
    return 'WT' // 这周
  }
  return 'lll'
}

function formatDate(date: IDate, locale: TimeLocale): string {
  const $d = parseDate(date)
  console.log(locale)
  const format = locale.formats[getFormat($d)]

  const dates: DateFormats = {
    YYYY: `${$d.getFullYear()}`,
    M: `${$d.getMonth() + 1}`,
    D: `${$d.getDate()}`,
    dddd: locale.weekdays[$d.getDay()],
    HH: padStart($d.getHours()),
    mm: padStart($d.getMinutes()),
  }

  return format.replace(REGEX_FORMAT, (match) => dates[match])
}

export default formatDate
