import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { gentlePulse } from '../utils/feedback.js'
import { chime, startAmbient } from '../utils/sound.js'

const MAX_EXTENSIONS = 2
const R = 120
const C = 2 * Math.PI * R

export default function FocusSession({ item, minutes, onDone, onClose }) {
  const { t } = useLanguage()
  const [total, setTotal] = useState(minutes * 60)
  const [left, setLeft] = useState(minutes * 60)
  const [paused, setPaused] = useState(false)
  const [extensions, setExtensions] = useState(0)
  const [rain, setRain] = useState(false)
  const endAt = useRef(Date.now() + minutes * 60_000)
  const stopRain = useRef(null)
  const ended = left === 0

  // Countdown based on wall clock so it stays right if the tab sleeps.
  useEffect(() => {
    if (paused || ended) return
    const id = setInterval(() => {
      const s = Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000))
      setLeft(s)
      if (s === 0) {
        chime()
        gentlePulse()
      }
    }, 250)
    return () => clearInterval(id)
  }, [paused, ended])

  // Keep the screen awake during a session where supported.
  useEffect(() => {
    let lock
    navigator.wakeLock?.request('screen').then((l) => (lock = l)).catch(() => {})
    return () => lock?.release().catch(() => {})
  }, [])

  useEffect(() => {
    if (rain && !ended) {
      stopRain.current = startAmbient()
      return () => stopRain.current?.()
    }
  }, [rain, ended])

  const togglePause = () => {
    if (paused) endAt.current = Date.now() + left * 1000
    setPaused((p) => !p)
  }

  const extend = () => {
    endAt.current = Date.now() + 5 * 60_000
    setTotal(5 * 60)
    setLeft(5 * 60)
    setExtensions((n) => n + 1)
  }

  const mm = Math.floor(left / 60)
  const ss = String(left % 60).padStart(2, '0')
  const progress = 1 - left / total

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center bg-bg px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(2rem,env(safe-area-inset-top))]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="max-w-sm text-center font-serif text-2xl leading-snug">{item.text}</p>

      <div className="relative my-auto flex items-center justify-center">
        <svg width="280" height="280" viewBox="0 0 280 280" className="-rotate-90">
          <circle cx="140" cy="140" r={R} fill="none" strokeWidth="10" className="stroke-mist" />
          <circle
            cx="140"
            cy="140"
            r={R}
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            className="stroke-sage transition-[stroke-dashoffset] duration-500 ease-linear"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - progress)}
          />
        </svg>
        <div className="absolute h-36 w-36 animate-breathe rounded-full bg-sage/15" />
        <div className="absolute text-center">
          {ended ? (
            <p className="font-serif text-3xl">{t.timeUp}</p>
          ) : (
            <p className="font-mono text-5xl tabular-nums">
              {mm}:{ss}
            </p>
          )}
        </div>
      </div>

      {ended ? (
        <div className="w-full max-w-sm space-y-3">
          <p className="text-center text-muted">{extensions >= MAX_EXTENSIONS ? t.takeBreak : t.howWasIt}</p>
          <button onClick={onDone} className="w-full rounded-full bg-sage py-4 font-semibold text-surface">
            ✓ {t.finished}
          </button>
          {extensions < MAX_EXTENSIONS && (
            <button onClick={extend} className="w-full rounded-full bg-mist py-4 font-semibold">
              {t.fiveMore}
            </button>
          )}
          <button onClick={onClose} className="w-full py-2 text-sm text-muted">
            {t.enough}
          </button>
        </div>
      ) : (
        <div className="w-full max-w-sm">
          <p className="mb-6 text-center text-sm text-muted">{t.focusHint}</p>
          <div className="flex gap-3">
            <button
              onClick={() => setRain((r) => !r)}
              className={`flex-1 rounded-full py-3 text-sm font-semibold ${rain ? 'bg-sage text-surface' : 'bg-mist'}`}
            >
              ☔︎ {t.sound}
            </button>
            <button onClick={togglePause} className="flex-1 rounded-full bg-mist py-3 text-sm font-semibold">
              {paused ? t.resume : t.pause}
            </button>
          </div>
          <div className="mt-3 flex gap-3">
            <button onClick={onDone} className="flex-1 rounded-full bg-sage py-3 text-sm font-semibold text-surface">
              ✓ {t.finished}
            </button>
            <button onClick={onClose} className="flex-1 rounded-full py-3 text-sm text-muted">
              {t.stop}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
