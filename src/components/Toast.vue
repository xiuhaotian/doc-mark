<script setup>
defineProps({
  toasts: { type: Array, default: () => [] },
})
</script>

<template>
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <div
      v-for="(toast, index) in toasts"
      :key="index"
      class="toast glass-card px-6 py-3 rounded-lg"
      :class="toast.type === 'error' ? 'border-l-4 border-red-500' : 'border-l-4 border-green-500'"
    >
      <p class="text-gray-800">{{ toast.message }}</p>
    </div>
  </div>
</template>
