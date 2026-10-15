import confetti from 'canvas-confetti'
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'

const native = Capacitor.isNativePlatform()

function vibrate(pattern) {
  try {
    navigator.vibrate?.(pattern)
  } catch {
    /* unsupported */
  }
}

export function hapticSuccess() {
  if (native) return Haptics.notification({ type: NotificationType.Success }).catch(() => {})
  vibrate([30, 40, 60])
}

export function hapticLight() {
  if (native) return Haptics.impact({ style: ImpactStyle.Light }).catch(() => {})
  vibrate(15)
}

export function hapticWarning() {
  if (native) return Haptics.notification({ type: NotificationType.Warning }).catch(() => {})
  vibrate([80, 60, 80])
}

export function celebrate() {
  confetti({
    particleCount: 90,
    spread: 75,
    origin: { y: 0.65 },
    colors: ['#a78bfa', '#f472b6', '#34d399', '#fbbf24'],
    disableForReducedMotion: true,
  })
}
