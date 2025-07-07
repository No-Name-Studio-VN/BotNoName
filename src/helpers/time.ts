const TIME_UNITS = {
  DAY: 86400,
  HOUR: 3600,
  MINUTE: 60,
  SECOND: 1
}

/**
 * Formats time duration into a human-readable string.
 */
export function timeformat(timeInSeconds: number) {
  if (!Number.isFinite(timeInSeconds) || timeInSeconds < 0) {
    throw new TypeError('Time must be a non-negative number')
  }

  const units = [
    { value: TIME_UNITS.DAY, label: 'days' },
    { value: TIME_UNITS.HOUR, label: 'hours' },
    { value: TIME_UNITS.MINUTE, label: 'minutes' },
    { value: TIME_UNITS.SECOND, label: 'seconds' }
  ]

  let remaining = timeInSeconds
  const parts = []

  for (const { value, label } of units) {
    const count = Math.floor(remaining / value)
    remaining %= value
    if (count > 0) {
      parts.push(`${count} ${label}`)
    }
  }

  return parts.join(', ') || '0 seconds'
}

/**
 * Calculates hour difference between two dates.
 */
export function diffHours(laterDate: Date, earlierDate: Date) {
  if (!(laterDate instanceof Date) || !(earlierDate instanceof Date)) {
    throw new TypeError('Arguments must be Date objects')
  }
  return Math.abs(Math.round((laterDate.getTime() - earlierDate.getTime()) / 3600000))
}

/**
 * Calculates remaining time until a specified date.
 */
export function getRemainingTime(targetDate: Date) {
  if (!(targetDate instanceof Date)) {
    throw new TypeError('Argument must be a Date object')
  }
  const diffSeconds = Math.abs((targetDate.getTime() - Date.now()) / 1000)
  return timeformat(diffSeconds)
}

/**
 * Converts duration string to milliseconds.
 */
export function durationToMillis(duration: string) {
  if (typeof duration !== 'string' || !/^\d{1,2}:\d{2}:\d{2}$/.test(duration)) {
    throw new TypeError('Duration must be in format "HH:MM:SS"')
  }

  const parts = duration.split(':').map(Number)
  return (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000
}
