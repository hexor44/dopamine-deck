# Dopamine Deck

Mobile-first PWA for people with ADHD: calm, one-thing-at-a-time focus helper.
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

## Concept
Calm, meditation-style ADHD helper (not a game). Flow: dump thoughts (text/voice) -> "Pick for me" suggests ONE item -> focus session with a ring countdown (5/15/25 min), optional synthesized rain sound -> on time-up a soft chime and "Done / 5 more minutes (max 2) / Enough for now" -> short random praise. Evening tab: 3-step day close-down. Subtle stats only (done today, day streak).

## Layout
- `src/App.jsx` – tabs (now / inbox / evening), focus-session overlay, praise toast
- `src/components/NowScreen.jsx` – breathing circle, "pick for me", duration picker
- `src/components/InboxScreen.jsx` + `CaptureBar.jsx` – thought dump, mic via Web Speech API (`hooks/useSpeech.js`)
- `src/components/FocusSession.jsx` – ring timer (wall-clock based), wake lock, rain, extensions
- `src/components/EveningScreen.jsx` – evening ritual
- `src/hooks/useStore.js` – items, done-per-day, evenings; persisted in localStorage (`dd.v2`)
- `src/utils/pick.js` – weighted random pick (older items weigh more)
- `src/utils/sound.js` – Web Audio rain + chime (no audio files)
- `src/i18n/` – PL/EN strings, default PL; add every UI string to both languages
- Colors are CSS variables in `src/index.css` (light + dark), mapped in `tailwind.config.js`

## Rules
- Calm tone: no confetti, no loud colors, no points-first gamification, no nagging notifications.
- Keep settings near zero; the target user abandons apps that need configuring.
- Any future photo input must be compressed client-side to max 800 px width before sending anywhere.
- No API keys committed. Camera and Gemini are intentionally out of scope for now.
