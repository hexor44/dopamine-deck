import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle } from '@capacitor/haptics'

const native = Capacitor.isNativePlatform()

export function softTap() {
  if (native) return Haptics.impact({ style: ImpactStyle.Light }).catch(() => {})
  try {
    navigator.vibrate?.(10)
  } catch {
    /* unsupported */
  }
}

export function gentlePulse() {
  if (native) return Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {})
  try {
    navigator.vibrate?.([60, 120, 60])
  } catch {
    /* unsupported */
  }
}
