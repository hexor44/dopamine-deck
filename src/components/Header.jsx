import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function Header({ doneToday, streakDays }) {
  const { t, lang, toggle } = useLanguage()
  return (
    <header className="flex items-start justify-between px-6 pb-2 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <div>
        <p className="font-serif text-2xl">{t.greeting(new Date().getHours())}</p>
        <p className="mt-1 text-sm text-muted">
          {t.doneToday(doneToday)}
          {streakDays > 1 && ` · ${t.streak(streakDays)}`}
        </p>
      </div>
      <button onClick={toggle} aria-label="language" className="rounded-full bg-mist px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted">
        {lang === 'pl' ? 'EN' : 'PL'}
      </button>
    </header>
  )
}
