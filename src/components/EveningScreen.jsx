import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { softTap } from '../utils/feedback.js'
import CaptureBar from './CaptureBar.jsx'

export default function EveningScreen({ done, eveningCount, onAdd, onFinish }) {
  const { t } = useLanguage()
  const [checked, setChecked] = useState([false, false, false])
  const all = checked.every(Boolean)

  const toggle = (i) => {
    softTap()
    setChecked((c) => c.map((v, k) => (k === i ? !v : v)))
  }

  if (done) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 text-6xl text-warm">☾</div>
        <p className="font-serif text-2xl">{t.eveningDone}</p>
        {eveningCount > 1 && <p className="mt-2 text-sm text-muted">{t.eveningStreak(eveningCount)}</p>}
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col px-6">
      <h2 className="font-serif text-3xl">{t.eveningTitle}</h2>
      <p className="mt-1 text-muted">{t.eveningSub}</p>

      <ol className="mt-6 space-y-3">
        {t.eveningSteps.map((step, i) => (
          <li key={step} className="rounded-2xl bg-surface p-4 ring-1 ring-mist">
            <button onClick={() => toggle(i)} className="flex w-full items-center gap-3 text-left active:scale-100">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-sm ${
                  checked[i] ? 'border-sage bg-sage text-surface' : 'border-mist text-muted'
                }`}
              >
                {checked[i] ? '✓' : i + 1}
              </span>
              <span className={checked[i] ? 'text-muted line-through decoration-sage/60' : ''}>{step}</span>
            </button>
            {i === 0 && !checked[0] && (
              <div className="mt-3">
                <CaptureBar onAdd={onAdd} placeholder={t.eveningAddPlaceholder} />
              </div>
            )}
          </li>
        ))}
      </ol>

      <button
        onClick={onFinish}
        disabled={!all}
        className="mt-auto mb-4 rounded-full bg-sage py-4 font-semibold text-surface transition-opacity disabled:opacity-30"
      >
        ☾ {t.goodnight}
      </button>
    </div>
  )
}
