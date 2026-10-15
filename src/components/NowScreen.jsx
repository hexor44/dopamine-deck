import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { isEvening } from '../utils/dates.js'
import { pickOne } from '../utils/pick.js'
import { softTap } from '../utils/feedback.js'
import DurationPicker from './DurationPicker.jsx'

export default function NowScreen({ open, eveningDone, onStart, goInbox, goEvening }) {
  const { t } = useLanguage()
  const [suggestion, setSuggestion] = useState(null)
  // Drop a suggestion that was completed or removed elsewhere.
  const current = suggestion && open.some((i) => i.id === suggestion.id) ? suggestion : null

  const pick = () => {
    softTap()
    setSuggestion(pickOne(open, current?.id))
  }

  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      {isEvening() && !eveningDone && (
        <button onClick={goEvening} className="absolute top-2 rounded-full bg-mist px-4 py-2 text-sm text-muted">
          ☾ {t.eveningNudge}
        </button>
      )}

      <div className="relative mb-8 flex h-40 w-40 items-center justify-center">
        <div className="absolute inset-0 animate-breathe rounded-full bg-sage/20" />
        <div className="absolute inset-6 animate-breathe rounded-full bg-sage/25 [animation-delay:-2s]" />
        <div className="h-16 w-16 rounded-full bg-warm/80" />
      </div>

      <AnimatePresence mode="wait">
        {!open.length ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-xs">
            <p className="text-lg leading-relaxed text-muted">{t.emptyNow}</p>
            <button onClick={goInbox} className="mt-6 rounded-full bg-sage px-6 py-3 font-semibold text-surface">
              {t.goCapture}
            </button>
          </motion.div>
        ) : current ? (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm"
          >
            <p className="text-sm uppercase tracking-widest text-muted">{t.maybeThis}</p>
            <p className="mt-3 font-serif text-3xl leading-snug">{current.text}</p>
            <p className="mb-3 mt-8 text-sm text-muted">{t.startHint}</p>
            <DurationPicker onPick={(m) => onStart(current, m)} />
            <div className="mt-4 flex justify-center gap-6 text-sm text-muted">
              {open.length > 1 && <button onClick={pick}>↻ {t.another}</button>}
              <button onClick={goInbox}>{t.chooseMyself}</button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="mb-6 text-lg text-muted">{t.nowSub}</p>
            <button onClick={pick} className="rounded-full bg-sage px-8 py-4 text-lg font-semibold text-surface shadow-sm">
              {t.pickForMe}
            </button>
            <button onClick={goInbox} className="mt-4 block w-full text-sm text-muted">
              {t.chooseMyself}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
