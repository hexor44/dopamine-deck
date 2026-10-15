import { createContext, useContext, useEffect, useState } from 'react'
import { STRINGS } from './strings.js'

const LanguageContext = createContext(null)
const KEY = 'dd.lang'

function initialLang() {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'pl' || saved === 'en') return saved
  } catch {
    /* storage unavailable */
  }
  return 'pl'
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(KEY, lang)
    } catch {
      /* storage unavailable */
    }
  }, [lang])

  const toggle = () => setLang((l) => (l === 'pl' ? 'en' : 'pl'))

  return (
    <LanguageContext.Provider value={{ lang, t: STRINGS[lang], toggle }}>
      {children}
    </LanguageContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => useContext(LanguageContext)
