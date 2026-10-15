# Dopamine Deck

Mobile-first PWA for people with ADHD: one swipeable micro-step card at a time.
Vite + React 18, Tailwind 3, Framer Motion, vite-plugin-pwa, Capacitor (Android, Haptics).

## Commands
- `npm install` – install deps
- `npm run dev` – dev server (exposed on LAN, open on phone via the printed IP)
- `npm run build` – production build to `dist/` (also generates service worker + manifest)
- `npm run preview` – serve `dist/`
- `npm run lint` – ESLint, must pass clean
- `npm run cap:add` – once: create `android/` project (needs Android SDK)
- `npm run cap:sync` – build web + copy to Android
- `npm run cap:open` – open Android Studio

## Layout
- `src/components/ActiveCard.jsx` – the single visible card: swipe right = done (+10 XP, confetti, haptic), swipe left = skip to bottom of deck, 120 s timer, "break into 3" button
- `src/components/ActionDock.jsx` – mic (Web Speech API) + text modal
- `src/services/taskService.js` – ONLY entry point for turning text into steps. Currently local-only (`localSplitter.js`). Plug an AI backend in here; it must never throw and must fall back to the local splitter.
- `src/hooks/useDeck.js` – deck state, persisted in localStorage (`dd.deck.v1`)
- `src/i18n/` – PL/EN strings, default PL; add every UI string to both languages
- `src/utils/feedback.js` – haptics (Capacitor on native, `navigator.vibrate` on web) + confetti

## Rules
- Screen never scrolls; one card visible at a time.
- Any future photo input must be compressed client-side to max 800 px width before sending anywhere.
- No API keys committed. Camera and Gemini are intentionally out of scope for now.
