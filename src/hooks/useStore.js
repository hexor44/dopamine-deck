import { useCallback, useEffect, useState } from 'react'
import { dayKey } from '../utils/dates.js'

const KEY = 'dd.v2'
const EMPTY = { items: [], doneDays: {}, evenings: {} }

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY))
    if (data && Array.isArray(data.items)) return { ...EMPTY, ...data }
  } catch {
    /* corrupted or unavailable storage */
  }
  return EMPTY
}

let seq = Date.now()

export function useStore() {
  const [state, setState] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* storage unavailable */
    }
  }, [state])

  const add = useCallback((text) => {
    const clean = text.trim()
    if (!clean) return
    setState((s) => ({ ...s, items: [{ id: String(seq++), text: clean, createdAt: Date.now() }, ...s.items] }))
  }, [])

  const remove = useCallback((id) => setState((s) => ({ ...s, items: s.items.filter((i) => i.id !== id) })), [])

  const complete = useCallback(
    (id) =>
      setState((s) => {
        const today = dayKey()
        return {
          ...s,
          items: s.items.map((i) => (i.id === id ? { ...i, doneAt: Date.now() } : i)),
          doneDays: { ...s.doneDays, [today]: (s.doneDays[today] || 0) + 1 },
        }
      }),
    [],
  )

  const finishEvening = useCallback(() => setState((s) => ({ ...s, evenings: { ...s.evenings, [dayKey()]: true } })), [])

  const open = state.items.filter((i) => !i.doneAt)
  const doneToday = state.doneDays[dayKey()] || 0

  return { ...state, open, doneToday, add, remove, complete, finishEvening }
}
