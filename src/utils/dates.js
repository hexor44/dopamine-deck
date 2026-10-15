export const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export function streak(days) {
  // Consecutive days up to today (or yesterday, so the streak survives until tonight).
  const d = new Date()
  if (!days[dayKey(d)]) d.setDate(d.getDate() - 1)
  let n = 0
  while (days[dayKey(d)]) {
    n++
    d.setDate(d.getDate() - 1)
  }
  return n
}

export const isEvening = () => new Date().getHours() >= 19
