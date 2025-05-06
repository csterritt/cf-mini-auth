/**
 * Returns the current time as a Date object. Use this instead of calling new Date() directly.
 * Optionally, pass arguments to forward to Date constructor.
 * @module lib/time-access
 */
let startTime: Date | null = null
let startTimeSetAt: number = 0

export const getCurrentTime = (...args: any[]): Date => {
  // if (args.length === 0) { // PRODUCTION:UNCOMMENT
  //   return new Date() // PRODUCTION:UNCOMMENT
  // } // PRODUCTION:UNCOMMENT

  // // @ts-ignore // PRODUCTION:UNCOMMENT
  // return new Date(...args) // PRODUCTION:UNCOMMENT

  let delta: number = 0
  if (startTime) {
    delta = Date.now() - startTimeSetAt
  }

  if (args.length === 0) {
    if (!startTime) {
      return new Date()
    }

    return new Date(startTime.getTime() + delta)
  }

  // Forward all arguments to Date constructor
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  if (!startTime) {
    // @ts-ignore
    return new Date(...args)
  }

  // @ts-ignore
  return new Date(new Date(...args).getTime() + delta)
}

export const setCurrentTime = (time: Date) => {
  startTime = time
  startTimeSetAt = Date.now()
}

export const clearCurrentTime = () => {
  startTime = null
  startTimeSetAt = 0
}
