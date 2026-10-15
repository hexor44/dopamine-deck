import { useLanguage } from '../i18n/LanguageContext.jsx'

const TABS = [
  { id: 'now', icon: '◯' },
  { id: 'inbox', icon: '☁︎' },
  { id: 'evening', icon: '☾' },
]

export default function NavBar({ tab, onChange }) {
  const { t } = useLanguage()
  return (
    <nav className="mx-6 mb-[max(1rem,env(safe-area-inset-bottom))] flex rounded-full bg-surface p-1 shadow-sm ring-1 ring-mist">
      {TABS.map(({ id, icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-medium ${
            tab === id ? 'bg-sage text-surface' : 'text-muted'
          }`}
        >
          <span aria-hidden>{icon}</span>
          {t.nav[id]}
        </button>
      ))}
    </nav>
  )
}
