import { useLanguage } from '../i18n/LanguageContext.jsx'

const DURATIONS = [5, 15, 25]

export default function DurationPicker({ onPick, compact }) {
  const { t } = useLanguage()
  return (
    <div className="flex gap-2">
      {DURATIONS.map((m, i) => (
        <button
          key={m}
          onClick={() => onPick(m)}
          className={`flex-1 rounded-2xl font-semibold ${compact ? 'py-2 text-sm' : 'py-4'} ${
            i === 0 ? 'bg-sage text-surface' : 'bg-mist text-ink'
          }`}
        >
          {t.startFor(m)}
        </button>
      ))}
    </div>
  )
}
