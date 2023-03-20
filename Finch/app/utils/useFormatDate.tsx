// Format dates

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat

import {
  addDays,
  addMinutes,
  differenceInSeconds,
  format,
  formatDistanceToNow,
  formatDuration,
  fromUnixTime,
  intervalToDuration,
  isDate,
  isFuture,
  isToday,
  isWithinInterval,
  parse,
  parseISO,
  subWeeks,
} from "date-fns"

export const useFormatDate = (dateString: string = "") => {
  let formattedDate = ""

  // parseISO(format(fieldValue, "yyy-MM-dd"));

  if (dateString) {
    try {
      const dateObj = parseISO(dateString)
      formattedDate = format(dateObj, "PP")
    } catch (e) {}
  }

  return formattedDate
}

export const runFormatDate = (dateString: string = "") => {
  let formattedDate = ""

  if (dateString) {
    try {
      const dateObj = parseISO(dateString)
      formattedDate = format(dateObj, "PP")
    } catch (e) {}
  }

  return formattedDate
}

export const runConvertAndFormatSchoolDate = (dateString: string = ""): string => {
  let formattedDate = ""

  try {
    const tempDateObj = new Date(dateString)

    // https://github.com/date-fns/date-fns/issues/1401#issuecomment-578580199
    let thisDate = format(addMinutes(tempDateObj, tempDateObj.getTimezoneOffset()), "yyyy-MM-dd")

    let realDate = parseISO(thisDate)

    if (isDate(realDate) && !isFuture(realDate)) {
      formattedDate = format(realDate, "MM/dd/yyyy")
    }
  } catch (e) {}

  return formattedDate
}

export const runConvertToDate = (dateString: string = ""): Date | null => {
  let dateObj: Date | null = null

  if (dateString) {
    try {
      dateObj = parseISO(dateString)
    } catch (e) {}
  }

  return dateObj
}

export const useFormatDateShortDate = (dateString: string = ""): string => {
  let formattedDate = ""

  if (dateString) {
    try {
      const dateObj = parseISO(dateString)
      formattedDate = format(dateObj, "MMM do")
    } catch (e) {}
  }
  return formattedDate
}

export const useFormatDateShortTime = (dateString: string = ""): string => {
  let formattedDate = ""

  if (dateString) {
    try {
      const dateObj = parseISO(dateString)
      formattedDate = format(dateObj, "h:mm a")
    } catch (e) {}
  }
  return formattedDate
}
export const useFormatDateShortDateTime = (dateString: string = ""): string => {
  let formattedDate = ""

  if (dateString) {
    try {
      const dateObj = parseISO(dateString)
      formattedDate = format(dateObj, "MMM do, h:mm a")
    } catch (e) {
      return ""
    }
  }
  return formattedDate
}

export const useFormatDateWithAt = (dateString: string = ""): string => {
  let formattedDate = ""

  if (dateString) {
    const dateObj = parseISO(dateString)

    formattedDate = `${format(dateObj, "MMM do")} at ${format(dateObj, "h:mm a")}`
  }
  return formattedDate
}

export const runFormatDateWithAt = (dateString: string = ""): string => {
  let formattedDate = ""

  try {
    if (dateString) {
      const dateObj = parseISO(dateString)

      formattedDate = `${format(dateObj, "MMM do")} at ${format(dateObj, "h:mm a")}`
    }
  } catch (e) {}
  return formattedDate
}

export const runFormatTodayShort = (): string => {
  return format(new Date(), "MMM do")
}

export const runFormatTodayPretty = (): string => {
  return format(new Date(), "EEEE, MMMM d")
}

export const runTodayTimestamp = (): number => {
  return Date.now()
}

export const runFormatLongDateWithAt = (dateString: string = ""): string => {
  let formattedDate = ""

  try {
    if (dateString) {
      const dateObj = parseISO(dateString)

      formattedDate = `${format(dateObj, "MMM do, yyyy")} at ${format(dateObj, "h:mm a")}`
    }
  } catch (e) {}
  return formattedDate
}

export const runFormatTimeWithAt = (timeSeconds: string = ""): string => {
  let formattedDate = ""

  try {
    if (timeSeconds) {
      const unixTime = parseInt(timeSeconds)
      const dataObj = fromUnixTime(unixTime)

      formattedDate = `${format(dataObj, "MMM do")} at ${format(dataObj, "h:mm a")}`
    }
  } catch (e) {}
  return formattedDate
}

export const runGetDateFromTime = (timeSeconds: string): Date => {
  const unixTime = parseInt(timeSeconds)
  const dataObj = fromUnixTime(unixTime)
  return dataObj
}

export const runGetSecondsFromDate = (dateIn: Date): number => {
  const diffSeconds = differenceInSeconds(new Date(), dateIn)

  return diffSeconds
}

export const runGetDurationTime = (seconds: number): string => {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 })
  // { minutes: 30, seconds: 7 }
  return formatDuration(duration)
}

export const runGetStopwatchFromSeconds = (seconds: number): string => {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 })
  // { minutes: 30, seconds: 7 }

  const zeroPad = (num) => String(num).padStart(2, "0")

  let formatted = ""
  if (duration.hours) {
    formatted = [duration.hours, duration.minutes, duration.seconds].map(zeroPad).join(":")
  } else {
    formatted = [duration.minutes, duration.seconds].map(zeroPad).join(":")
  }

  return formatted
}

export const runGetStopwatchFromDate = (dateIn: Date): string => {
  let seconds = runGetSecondsFromDate(dateIn)

  return runGetStopwatchFromSeconds(seconds)
}

export const runFormatLongTimeWithAt = (timeSeconds: string = ""): string => {
  let formattedDate = ""

  try {
    if (timeSeconds) {
      const unixTime = parseInt(timeSeconds)
      const dataObj = fromUnixTime(unixTime)

      formattedDate = `${format(dataObj, "MMM do, yyyy")} at ${format(dataObj, "h:mm a")}`
    }
  } catch (e) {}
  return formattedDate
}

export const runFormatMinuteTime = (timeSeconds: string = ""): string => {
  let formattedDate = ""

  try {
    if (timeSeconds) {
      const unixTime = parseInt(timeSeconds)
      const dataObj = fromUnixTime(unixTime)

      formattedDate = format(dataObj, "h:mm a")
    }
  } catch (e) {}
  return formattedDate
}

export const runFormatLongTime = (timeSeconds: string = ""): string => {
  let formattedDate = ""

  try {
    if (timeSeconds) {
      const unixTime = parseInt(timeSeconds)
      const dataObj = fromUnixTime(unixTime)

      formattedDate = format(dataObj, "MMM do, yyyy")
    }
  } catch (e) {}
  return formattedDate
}

export const runFormatLongTimeAddDays = (
  timeSeconds: string = "",
  magnitude: number = 1,
): string => {
  let formattedDate = ""

  try {
    if (timeSeconds) {
      const unixTime = parseInt(timeSeconds)
      const dataObj = fromUnixTime(unixTime)

      const dateNextObj = addDays(dataObj, magnitude)

      formattedDate = format(dateNextObj, "MMM do, yyyy")
    }
  } catch (e) {}
  return formattedDate
}

export const runFormatDateToSimple = (dateObj: Date) => {
  let formattedDate = ""

  if (dateObj) {
    try {
      formattedDate = format(dateObj, "yyyy-MM-dd")
    } catch (e) {}
  }

  return formattedDate
}

export const runFormatTimeFromNowSpecial = (timeSeconds: string): string => {
  let formattedDate = ""

  try {
    if (timeSeconds) {
      const unixTime = parseInt(timeSeconds)
      const dataObj = fromUnixTime(unixTime)

      if (isToday(dataObj)) {
        formattedDate = format(dataObj, "h:mm a")
      } else {
        // Is is more than a month ago?
        const dataIsWithinLast1Months = isWithinInterval(dataObj, {
          start: subWeeks(new Date(), 4),
          end: new Date(),
        })

        if (dataIsWithinLast1Months) {
          formattedDate = formatDistanceToNow(dataObj)
          formattedDate = `${formatDistanceToNow(dataObj)} ago`
        } else {
          // Is is more than 6 months ago?
          const dataIsWithinLast6Months = isWithinInterval(dataObj, {
            start: subWeeks(new Date(), 24),
            end: new Date(),
          })

          if (dataIsWithinLast6Months) {
            formattedDate = format(dataObj, "MMM do")
          } else {
            formattedDate = format(dataObj, "MM/dd/yy")
          }
        }
      }
    }
  } catch (e) {}
  return formattedDate
}
export const runFormatTimeFromNow = (timeSeconds: string): string => {
  let formattedDate = ""

  try {
    if (timeSeconds) {
      const unixTime = parseInt(timeSeconds)
      const momentObj = fromUnixTime(unixTime)
      formattedDate = formatDistanceToNow(momentObj)

      if (isFuture(momentObj)) {
        formattedDate = `in ${formatDistanceToNow(momentObj)}`
      } else {
        formattedDate = `${formatDistanceToNow(momentObj)} ago`
      }
    }
  } catch (e) {}
  return formattedDate
}

export const runFormatDateFromNow = (dateValue: string): string => {
  let formattedDate = ""

  try {
    if (dateValue) {
      const dateObj = parseISO(dateValue)
      formattedDate = `${formatDistanceToNow(dateObj)} ago`
    }
  } catch (e) {}
  return formattedDate
}

export const runFormat24Hrto12Hr = (hoursIn: string): string => {
  let formattedDate = ""

  try {
    const hhMM = `${hoursIn.slice(0, 2)}:${hoursIn.slice(2, 5)}`

    formattedDate = format(parse(hhMM, "HH:mm", new Date()), "hh:mm a")
  } catch (e) {}

  return formattedDate
}
