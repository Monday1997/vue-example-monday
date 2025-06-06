import { ref } from 'vue'
import type { CSSProperties } from 'vue'

export function refNull<T>(data?: any) {
  return ref<T>(data || null as T)
}
export function refStyle() {
  return ref<CSSProperties>({})
}
