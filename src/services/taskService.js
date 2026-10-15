// Single boundary for task breakdown. Today it only uses the local splitter;
// an AI backend (e.g. a Gemini proxy) can be plugged in here later without
// touching any component. Must never throw: callers always get steps back.
import { breakStepLocally, splitTaskLocally } from './localSplitter.js'

let nextId = Date.now()
const withIds = (steps) => steps.map((s) => ({ id: String(nextId++), ...s }))

export async function generateSteps(text, lang) {
  return withIds(splitTaskLocally(text, lang))
}

export async function breakDownStep(step, lang) {
  return withIds(breakStepLocally(step, lang))
}
