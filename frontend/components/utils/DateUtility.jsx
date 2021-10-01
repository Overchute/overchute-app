import { add } from "date-fns"

export let today = new Date()
export let tomorrow = add(new Date(), { days: 1 })
const now = new Date()

export const utcMilllisecondsSinceEpoch =
  now.getTime() + now.getTimezoneOffset() * 60 * 1000
export const sametimeTomorrowUTC = utcMilllisecondsSinceEpoch + 86400000
export const midnightUTCDeadlineInNanos = (d) => {
  let mud = new Date(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate(),
    23,
    59,
    0,
  )
  return mud * 1000000
}
export const minUTCDeadline = new Date(
  now.getUTCFullYear(),
  now.getUTCMonth(),
  now.getUTCDate() + 1,
  23,
  59,
  0,
)

export const convertToNanoseconds = (v) => {
  return v * 1000000
}

export const transformDateNanosToSecs = (bn) => {
  let x = Number(bn) / 1000000
  let dateInSec = Number(x)
  return dateInSec
}
