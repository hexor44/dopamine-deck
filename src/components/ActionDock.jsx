import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { useSpeech } from '../hooks/useSpeech.js'
import TextInputModal from './TextInputModal.jsx'

export default function ActionDock({ onInput }) {
  const { t } = useLanguage()
  const [modalOpen, setModalOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const speech = useSpeech({ lang: t.speechLang, onResult: onInput })

  const onMic = () => {
    if (speech.listening) return speech.stop()
    if (!speech.start()) {
      setNotice(t.micUnsupported)
      setTimeout(() => setNotice(''), 3500)
    }
  }

  return (
    <>
      {notice && <p className="mx-4 mb-2 rounded-xl bg-white/10 p-2 text-center text-xs text-white/80">{notice}</p>}
      <nav className="flex items-center justify-center gap-6 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2">
        <button
          onClick={onMic}
          aria-label={t.mic}
          className={`flex h-16 w-16 flex-col items-center justify-center rounded-full text-2xl shadow-lg active:scale-90 ${
            speech.listening ? 'animate-pulse bg-deck-hot' : 'bg-deck-accent text-deck-bg'
          }`}
        >
          🎤
        </button>
        <button
          onClick={() => setModalOpen(true)}
          aria-label={t.type}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-2xl shadow-lg active:scale-90"
        >
          ⌨️
        </button>
      </nav>
      {speech.listening && <p className="-mt-1 pb-2 text-center text-xs text-deck-hot">{t.listening}</p>}
      <TextInputModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={onInput} />
    </>
  )
}
