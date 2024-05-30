import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

const userTimeZone = dayjs.tz.guess()

export const formatDateTime = (
  timestamp: string,
  format: string = 'MMM D, YYYY [at] h:mm A',
): string => {
  const date = dayjs(timestamp)

  return date.tz(userTimeZone).format(format)
}
