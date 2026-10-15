// Offline task breakdown. Always works, no network, no API key.

const TEMPLATES = {
  pl: {
    start: (t) => ({ title: `Przygotuj miejsce do: ${t}`, subtitle: 'Tylko przygotuj. Nic więcej.' }),
    first: (t) => ({ title: `Zrób najmniejszy pierwszy ruch: ${t}`, subtitle: 'Wystarczą 2 minuty.' }),
    keep: (t) => ({ title: `Kontynuuj jeszcze chwilę: ${t}`, subtitle: 'Jeśli płynie, jedź dalej.' }),
    wrap: (t) => ({ title: `Zamknij temat: ${t}`, subtitle: 'Odłóż rzeczy, odhacz, świętuj.' }),
    micro: [
      (t) => ({ title: `Tylko spójrz na: ${t}`, subtitle: 'Zero działania, sam kontakt wzrokowy.' }),
      (t) => ({ title: `Dotknij pierwszej rzeczy: ${t}`, subtitle: 'Weź do ręki, otwórz, kliknij.' }),
      (t) => ({ title: `30 sekund: ${t}`, subtitle: 'Potem możesz przestać.' }),
    ],
    connectors: /\s*(?:,|;|\n|\.|\bi\b|\boraz\b|\bpotem\b|\ba potem\b)\s*/i,
  },
  en: {
    start: (t) => ({ title: `Set up for: ${t}`, subtitle: 'Just set up. Nothing more.' }),
    first: (t) => ({ title: `Do the tiniest first move: ${t}`, subtitle: 'Two minutes is enough.' }),
    keep: (t) => ({ title: `Keep going a bit: ${t}`, subtitle: 'If it flows, ride it.' }),
    wrap: (t) => ({ title: `Wrap it up: ${t}`, subtitle: 'Put things away, check it off, celebrate.' }),
    micro: [
      (t) => ({ title: `Just look at: ${t}`, subtitle: 'No action, only eye contact.' }),
      (t) => ({ title: `Touch the first thing: ${t}`, subtitle: 'Pick it up, open it, click it.' }),
      (t) => ({ title: `30 seconds of: ${t}`, subtitle: 'Then you are allowed to stop.' }),
    ],
    connectors: /\s*(?:,|;|\n|\.|\band then\b|\band\b|\bthen\b)\s*/i,
  },
}

const clean = (s) => s.trim().replace(/\s+/g, ' ').replace(/[.!?]+$/, '')
const lower = (s) => s.charAt(0).toLowerCase() + s.slice(1)

export function splitTaskLocally(text, lang = 'pl') {
  const tpl = TEMPLATES[lang] ?? TEMPLATES.pl
  const task = clean(text)
  if (!task) return []

  const parts = task.split(tpl.connectors).map(clean).filter((p) => p.length > 1)

  // User already listed several actions: one card each, bookended by setup and wrap-up.
  if (parts.length >= 2) {
    const first = parts[0]
    const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)
    return [
      tpl.start(lower(first)),
      ...parts.slice(0, 6).map((p) => ({ title: cap(p), subtitle: tpl.first('').subtitle })),
      tpl.wrap(lower(task)),
    ]
  }

  const t = lower(task)
  return [tpl.start(t), tpl.first(t), tpl.keep(t), tpl.wrap(t)]
}

export function breakStepLocally(step, lang = 'pl') {
  const tpl = TEMPLATES[lang] ?? TEMPLATES.pl
  // Drop an earlier template prefix ("Set up for: x") so prompts don't nest.
  const t = lower(clean(step.title.split(': ').pop()))
  return tpl.micro.map((fn) => fn(t))
}
