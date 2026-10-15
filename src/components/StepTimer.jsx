import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { hapticWarning } from '../utils/feedback.js'

const DURATION = 120

export default function StepTimer() {
  const { t } = useLanguage()
  const [left, setLeft] = useState(DURATION)
  const [running, setRunning] = useState(false)
  const endRef = useRef(0)

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endRef.current - Date.now()) / 1000))
      setLeft(remaining)
      if (remaining === 0) {
        setRunning(false)
        hapticWarning()
      }
    }, 250)
    return () => clearInterval(id)
  }, [running])

  const start = () => {
    endRef.current = Date.now() + DURATION * 1000
    setLeft(DURATION)
    setRunning(true)
  }

  const mm = Math.floor(left / 60)
  const ss = String(left % 60).padStart(2, '0')
  const progress = 1 - left / DURATION

  return (
    <div className="w-full" onPointerDownCapture={(e) => e.stopPropagation()}>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-deck-accent to-deck-hot transition-[width] duration-300 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="font-mono tabular-nums text-white/80">
          ⏱ {mm}:{ss}
        </span>
        {left === 0 ? (
          <span className="text-deck-ok">{t.timeUp}</span>
        ) : (
          !running && (
            <button onClick={start} className="rounded-full bg-white/10 px-3 py-1 font-medium active:scale-95">
              {t.startTimer}
            </button>
          )
        )}
      </div>
    </div>
  )
}
