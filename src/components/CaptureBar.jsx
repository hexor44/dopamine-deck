import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { useSpeech } from '../hooks/useSpeech.js'
import { softTap } from '../utils/feedback.js'

export default function CaptureBar({ onAdd, placeholder, autoFocus }) {
  const { t } = useLanguage()
  const [text, setText] = useState('')
  const [notice, setNotice] = useState('')
  const speech = useSpeech({
    lang: t.speechLang,
    onResult: (said) => {
      onAdd(said)
      softTap()
    },
  })

  const submit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    onAdd(text)
    setText('')
    softTap()
  }

  const onMic = () => {
    if (speech.listening) return speech.stop()
    if (!speech.start()) {
      setNotice(t.micUnsupported)
      setTimeout(() => setNotice(''), 3500)
    }
  }

  return (
    <div>
      <form onSubmit={submit} className="flex items-center gap-2 rounded-3xl bg-surface p-2 shadow-sm ring-1 ring-mist">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={speech.listening ? t.listening : placeholder ?? t.capturePlaceholder}
          autoFocus={autoFocus}
          enterKeyHint="done"
          className="min-w-0 flex-1 bg-transparent px-3 py-2 text-base outline-none placeholder:text-muted"
        />
        <button
          type="button"
          onClick={onMic}
          aria-label={t.mic}
          className={`h-11 w-11 shrink-0 rounded-full text-lg ${speech.listening ? 'animate-pulse bg-warm text-surface' : 'bg-mist'}`}
        >
          🎙
        </button>
        {text.trim() && (
          <button type="submit" className="h-11 shrink-0 rounded-full bg-sage px-4 text-sm font-semibold text-surface">
            {t.add}
          </button>
        )}
      </form>
      {notice && <p className="mt-2 text-center text-xs text-muted">{notice}</p>}
    </div>
  )
}
