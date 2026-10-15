import { useCallback, useEffect, useState } from 'react'

const KEY = 'dd.deck.v1'
export const XP_PER_STEP = 10

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (Array.isArray(data.cards)) return { cards: data.cards, xp: Number(data.xp) || 0, doneCount: Number(data.doneCount) || 0 }
    }
  } catch {
    /* corrupted or unavailable storage */
  }
  return { cards: [], xp: 0, doneCount: 0 }
}

export function useDeck() {
  const [state, setState] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* storage unavailable */
    }
  }, [state])

  const addCards = useCallback((cards) => setState((s) => ({ ...s, cards: [...s.cards, ...cards] })), [])

  const complete = useCallback(
    () => setState((s) => ({ cards: s.cards.slice(1), xp: s.xp + XP_PER_STEP, doneCount: s.doneCount + 1 })),
    [],
  )

  // Skip without guilt: the card goes to the bottom of the deck.
  const skip = useCallback(
    () => setState((s) => (s.cards.length > 1 ? { ...s, cards: [...s.cards.slice(1), s.cards[0]] } : s)),
    [],
  )

  // Replace the top card with smaller steps.
  const replaceTop = useCallback((cards) => setState((s) => ({ ...s, cards: [...cards, ...s.cards.slice(1)] })), [])

  const clear = useCallback(() => setState((s) => ({ ...s, cards: [] })), [])

  return { ...state, current: state.cards[0] ?? null, addCards, complete, skip, replaceTop, clear }
}
