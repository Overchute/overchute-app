export const transformDateNanosToSecs = (bn) => {
  let x = Number(bn) / 1000000
  let dateInSec = Number(x)
  return dateInSec
}

export let today = new Date()
export let tomorrow = new Date()
