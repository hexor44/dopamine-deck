import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function TextInputModal({ open, onClose, onSubmit }) {
  const { t } = useLanguage()
  const [text, setText] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setText('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const submit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    onSubmit(text)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.form
            onSubmit={submit}
            onClick={(e) => e.stopPropagation()}
            className="w-full rounded-t-3xl bg-deck-card p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
          >
            <h3 className="mb-3 text-lg font-bold">{t.modalTitle}</h3>
            <textarea
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.modalPlaceholder}
              rows={3}
              className="w-full resize-none rounded-2xl bg-white/10 p-3 text-base outline-none ring-deck-accent focus:ring-2"
            />
            <div className="mt-3 flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 rounded-2xl bg-white/10 py-3 font-semibold">
                {t.cancel}
              </button>
              <button type="submit" className="flex-1 rounded-2xl bg-deck-accent py-3 font-semibold text-deck-bg">
                {t.add}
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
