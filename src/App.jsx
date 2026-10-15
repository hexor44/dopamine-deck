import { useState } from 'react'
import ActiveCard from './components/ActiveCard.jsx'
import ActionDock from './components/ActionDock.jsx'
import Header from './components/Header.jsx'
import { useDeck } from './hooks/useDeck.js'
import { useLanguage } from './i18n/LanguageContext.jsx'
import { breakDownStep, generateSteps } from './services/taskService.js'
import { celebrate, hapticLight, hapticSuccess } from './utils/feedback.js'

export default function App() {
  const { t, lang } = useLanguage()
  const deck = useDeck()
  const [breaking, setBreaking] = useState(false)

  const addTask = async (text) => {
    const steps = await generateSteps(text, lang)
    if (steps.length) {
      deck.addCards(steps)
      hapticLight()
    }
  }

  const onDone = () => {
    hapticSuccess()
    celebrate()
    deck.complete()
  }

  const onSkip = () => {
    hapticLight()
    deck.skip()
  }

  const onBreakDown = async () => {
    if (!deck.current) return
    setBreaking(true)
    try {
      deck.replaceTop(await breakDownStep(deck.current, lang))
      hapticLight()
    } finally {
      setBreaking(false)
    }
  }

  const empty = !deck.current

  return (
    <div className="mx-auto flex h-full max-w-md flex-col">
      <Header xp={deck.xp} remaining={deck.cards.length} onClear={deck.clear} />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-5">
        {!empty && deck.cards.length > 1 && (
          <div className="absolute h-[60%] w-[78%] max-w-xs translate-y-4 rotate-3 rounded-3xl bg-deck-card/50 ring-1 ring-white/5" />
        )}
        {empty ? (
          <div className="max-w-xs text-center">
            <div className="mb-4 text-6xl">{deck.doneCount ? '🎉' : '🃏'}</div>
            <h2 className="text-2xl font-bold">{deck.doneCount ? t.allDoneTitle : t.emptyTitle}</h2>
            <p className="mt-2 text-white/60">{deck.doneCount ? t.allDoneHint : t.emptyHint}</p>
            <button
              onClick={() => addTask(t.example)}
              className="mt-6 rounded-full bg-white/10 px-4 py-2 text-sm font-medium active:scale-95"
            >
              ✨ {t.example}
            </button>
          </div>
        ) : (
          <ActiveCard
            key={deck.current.id}
            card={deck.current}
            onDone={onDone}
            onSkip={onSkip}
            onBreakDown={onBreakDown}
            breaking={breaking}
          />
        )}
      </main>

      <ActionDock onInput={addTask} />
    </div>
  )
}
