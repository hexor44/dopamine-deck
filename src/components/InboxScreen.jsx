import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import CaptureBar from './CaptureBar.jsx'
import DurationPicker from './DurationPicker.jsx'

export default function InboxScreen({ open, doneToday, onAdd, onRemove, onStart }) {
  const { t } = useLanguage()
  const [expanded, setExpanded] = useState(null)

  return (
    <div className="flex h-full flex-col px-6">
      <CaptureBar onAdd={onAdd} />
      <p className="mt-2 px-2 text-xs text-muted">{t.captureHint}</p>

      <div className="mt-4 flex-1 overflow-y-auto pb-4">
        {!open.length && !doneToday.length && <p className="mt-16 text-center text-muted">{t.inboxEmpty}</p>}
        <ul className="space-y-2">
          <AnimatePresence initial={false}>
            {open.map((item) => (
              <motion.li
                key={item.id}
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 40 }}
                className="rounded-2xl bg-surface p-4 ring-1 ring-mist"
              >
                <button onClick={() => setExpanded(expanded === item.id ? null : item.id)} className="w-full text-left active:scale-100">
                  {item.text}
                </button>
                {expanded === item.id && (
                  <div className="mt-3 space-y-2">
                    <DurationPicker compact onPick={(m) => onStart(item, m)} />
                    <button onClick={() => onRemove(item.id)} className="w-full py-1 text-xs text-muted">
                      {t.remove}
                    </button>
                  </div>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {doneToday.length > 0 && (
          <>
            <p className="mb-2 mt-6 px-2 text-xs uppercase tracking-widest text-muted">{t.doneList}</p>
            <ul className="space-y-1">
              {doneToday.map((item) => (
                <li key={item.id} className="px-2 text-sm text-muted line-through decoration-sage/60">
                  {item.text}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
