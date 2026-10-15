import { AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import EveningScreen from './components/EveningScreen.jsx'
import FocusSession from './components/FocusSession.jsx'
import Header from './components/Header.jsx'
import InboxScreen from './components/InboxScreen.jsx'
import NavBar from './components/NavBar.jsx'
import NowScreen from './components/NowScreen.jsx'
import Praise from './components/Praise.jsx'
import { useStore } from './hooks/useStore.js'
import { useLanguage } from './i18n/LanguageContext.jsx'
import { dayKey, streak } from './utils/dates.js'
import { gentlePulse } from './utils/feedback.js'

export default function App() {
  const { t } = useLanguage()
  const store = useStore()
  const [tab, setTab] = useState('now')
  const [session, setSession] = useState(null)
  const [praise, setPraise] = useState('')
  const praiseTimer = useRef(null)

  const startOfToday = new Date().setHours(0, 0, 0, 0)
  const doneToday = store.items.filter((i) => i.doneAt >= startOfToday)
  const eveningDone = Boolean(store.evenings[dayKey()])

  const showPraise = () => {
    setPraise(t.praise[Math.floor(Math.random() * t.praise.length)])
    clearTimeout(praiseTimer.current)
    praiseTimer.current = setTimeout(() => setPraise(''), 2600)
  }

  const finishSession = () => {
    store.complete(session.item.id)
    setSession(null)
    gentlePulse()
    showPraise()
  }

  const start = (item, minutes) => setSession({ item, minutes })

  return (
    <div className="mx-auto flex h-full max-w-md flex-col">
      <Header doneToday={store.doneToday} streakDays={streak(store.doneDays)} />

      <main className="relative min-h-0 flex-1 pt-4">
        {tab === 'now' && (
          <NowScreen
            open={store.open}
            eveningDone={eveningDone}
            onStart={start}
            goInbox={() => setTab('inbox')}
            goEvening={() => setTab('evening')}
          />
        )}
        {tab === 'inbox' && (
          <InboxScreen open={store.open} doneToday={doneToday} onAdd={store.add} onRemove={store.remove} onStart={start} />
        )}
        {tab === 'evening' && (
          <EveningScreen
            done={eveningDone}
            eveningCount={streak(store.evenings)}
            onAdd={store.add}
            onFinish={() => {
              store.finishEvening()
              gentlePulse()
            }}
          />
        )}
      </main>

      <NavBar tab={tab} onChange={setTab} />

      <AnimatePresence>
        {session && (
          <FocusSession
            key={session.item.id}
            item={session.item}
            minutes={session.minutes}
            onDone={finishSession}
            onClose={() => setSession(null)}
          />
        )}
      </AnimatePresence>

      <Praise text={praise} />
    </div>
  )
}
