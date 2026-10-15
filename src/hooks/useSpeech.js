import { useCallback, useEffect, useRef, useState } from 'react'

const Recognition = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null

export function useSpeech({ lang, onResult }) {
  const [listening, setListening] = useState(false)
  const recRef = useRef(null)
  const onResultRef = useRef(onResult)
  onResultRef.current = onResult

  useEffect(() => () => recRef.current?.abort(), [])

  const start = useCallback(() => {
    if (!Recognition || listening) return false
    const rec = new Recognition()
    rec.lang = lang
    rec.interimResults = false
    rec.maxAlternatives = 1
    rec.onresult = (e) => {
      const text = e.results?.[0]?.[0]?.transcript
      if (text) onResultRef.current(text)
    }
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    recRef.current = rec
    rec.start()
    setListening(true)
    return true
  }, [lang, listening])

  const stop = useCallback(() => recRef.current?.stop(), [])

  return { supported: Boolean(Recognition), listening, start, stop }
}
