import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function Header({ xp, remaining, onClear }) {
  const { t, lang, toggle } = useLanguage()
  return (
    <header className="flex items-center justify-between px-4 pb-2 pt-[max(1rem,env(safe-area-inset-top))]">
      <div>
        <h1 className="text-lg font-extrabold tracking-tight">🃏 {t.appName}</h1>
        <button onClick={onClear} disabled={!remaining} className="text-xs text-white/40 disabled:invisible">
          {t.remaining(remaining)} · {t.clear}
        </button>
      </div>
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-deck-accent/20 px-3 py-1 text-sm font-bold text-deck-accent">
          {xp} {t.xp}
        </span>
        <button onClick={toggle} className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold uppercase" aria-label="language">
          {lang === 'pl' ? 'EN' : 'PL'}
        </button>
      </div>
    </header>
  )
}
