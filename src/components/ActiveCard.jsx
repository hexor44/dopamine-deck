import { useEffect } from 'react'
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import StepTimer from './StepTimer.jsx'

const THRESHOLD = 110

export default function ActiveCard({ card, onDone, onSkip, onBreakDown, breaking }) {
  const { t } = useLanguage()
  const x = useMotionValue(0)
  const controls = useAnimation()
  const rotate = useTransform(x, [-200, 200], [-12, 12])
  const doneOpacity = useTransform(x, [20, THRESHOLD], [0, 1])
  const skipOpacity = useTransform(x, [-THRESHOLD, -20], [1, 0])

  useEffect(() => {
    controls.start({ scale: 1, opacity: 1, y: 0, transition: { duration: 0.25 } })
  }, [controls])

  const fling = async (dir) => {
    await controls.start({ x: dir * 600, opacity: 0, transition: { duration: 0.25 } })
    if (dir > 0) onDone()
    else onSkip()
  }

  const onDragEnd = (_, info) => {
    const power = info.offset.x + info.velocity.x * 0.2
    if (power > THRESHOLD) fling(1)
    else if (power < -THRESHOLD) fling(-1)
    else controls.start({ x: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } })
  }

  return (
    <motion.div
      className="relative flex w-full max-w-sm touch-none flex-col gap-5 rounded-3xl bg-deck-card p-6 shadow-2xl shadow-black/50 ring-1 ring-white/10"
      style={{ x, rotate }}
      drag="x"
      dragElastic={0.7}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={onDragEnd}
      animate={controls}
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
    >
      <motion.span
        style={{ opacity: doneOpacity }}
        className="pointer-events-none absolute left-5 top-5 rotate-[-12deg] rounded-lg border-2 border-deck-ok px-2 py-1 text-sm font-bold uppercase text-deck-ok"
      >
        {t.done}
      </motion.span>
      <motion.span
        style={{ opacity: skipOpacity }}
        className="pointer-events-none absolute right-5 top-5 rotate-[12deg] rounded-lg border-2 border-white/60 px-2 py-1 text-sm font-bold uppercase text-white/70"
      >
        {t.skip}
      </motion.span>

      <div className="mt-8 min-h-[7rem]">
        <h2 className="text-2xl font-bold leading-tight">{card.title}</h2>
        {card.subtitle && <p className="mt-2 text-base text-white/60">{card.subtitle}</p>}
      </div>

      <StepTimer key={card.id} />

      <button
        onPointerDownCapture={(e) => e.stopPropagation()}
        onClick={onBreakDown}
        disabled={breaking}
        className="rounded-2xl border border-deck-hot/50 bg-deck-hot/10 px-4 py-3 text-sm font-semibold text-deck-hot active:scale-[0.98] disabled:opacity-50"
      >
        🧩 {t.paralysis}
      </button>

      <div className="flex gap-3" onPointerDownCapture={(e) => e.stopPropagation()}>
        <button onClick={() => fling(-1)} className="flex-1 rounded-2xl bg-white/10 py-3 font-semibold active:scale-95">
          {t.skip}
        </button>
        <button onClick={() => fling(1)} className="flex-1 rounded-2xl bg-deck-ok py-3 font-semibold text-deck-bg active:scale-95">
          ✓ {t.done}
        </button>
      </div>

      <p className="text-center text-xs text-white/40">{t.swipeHint}</p>
    </motion.div>
  )
}
