// Choose one open item, avoiding the one just shown. Older thoughts weigh a bit more
// so nothing sits forgotten forever.
export function pickOne(items, avoidId) {
  const pool = items.length > 1 ? items.filter((i) => i.id !== avoidId) : items
  if (!pool.length) return null
  const now = Date.now()
  const weights = pool.map((i) => 1 + Math.min(3, (now - i.createdAt) / 86_400_000))
  let r = Math.random() * weights.reduce((a, b) => a + b, 0)
  for (let k = 0; k < pool.length; k++) {
    r -= weights[k]
    if (r <= 0) return pool[k]
  }
  return pool[pool.length - 1]
}
