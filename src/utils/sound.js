// All sound is synthesized with Web Audio: no audio files to ship.
let ctx = null
const audio = () => (ctx ??= new (window.AudioContext || window.webkitAudioContext)())

// Soft brown noise through a low-pass filter, like distant rain.
export function startAmbient() {
  const ac = audio()
  ac.resume?.()
  const len = ac.sampleRate * 4
  const buffer = ac.createBuffer(1, len, ac.sampleRate)
  const data = buffer.getChannelData(0)
  let last = 0
  for (let i = 0; i < len; i++) {
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02
    data[i] = last * 3.2
  }
  const src = ac.createBufferSource()
  src.buffer = buffer
  src.loop = true
  const filter = ac.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 700
  const gain = ac.createGain()
  gain.gain.setValueAtTime(0, ac.currentTime)
  gain.gain.linearRampToValueAtTime(0.35, ac.currentTime + 2)
  src.connect(filter).connect(gain).connect(ac.destination)
  src.start()
  return () => {
    gain.gain.cancelScheduledValues(ac.currentTime)
    gain.gain.setValueAtTime(gain.gain.value, ac.currentTime)
    gain.gain.linearRampToValueAtTime(0, ac.currentTime + 1)
    setTimeout(() => src.stop(), 1100)
  }
}

// Two soft bell tones.
export function chime() {
  try {
    const ac = audio()
    ac.resume?.()
    ;[523.25, 783.99].forEach((f, i) => {
      const t = ac.currentTime + i * 0.35
      const osc = ac.createOscillator()
      const g = ac.createGain()
      osc.type = 'sine'
      osc.frequency.value = f
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(0.25, t + 0.02)
      g.gain.exponentialRampToValueAtTime(0.001, t + 2.5)
      osc.connect(g).connect(ac.destination)
      osc.start(t)
      osc.stop(t + 2.6)
    })
  } catch {
    /* audio unavailable */
  }
}
