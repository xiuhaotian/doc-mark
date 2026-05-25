import { ref } from 'vue'

const toasts = ref([])

export function useToast() {
  function showToast(message, type = 'success') {
    toasts.value.push({ message, type })
    setTimeout(() => {
      toasts.value.shift()
    }, 3000)
  }

  return { toasts, showToast }
}
