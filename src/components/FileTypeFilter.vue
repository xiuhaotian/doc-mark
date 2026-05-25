<script setup>
import { ref } from 'vue'

const currentFilter = ref('all')
const types = [
  { key: 'all', icon: '📄', label: '全部' },
  { key: 'docx', icon: '📝', label: 'Word' },
  { key: 'pdf', icon: '📕', label: 'PDF' },
  { key: 'excel', icon: '📊', label: 'Excel' },
]
</script>

<template>
  <div class="glass-card rounded-2xl p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4">选择文件类型</h3>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <button
        v-for="t in types"
        :key="t.key"
        class="file-type-btn rounded-xl p-4 text-center"
        :class="{ active: currentFilter === t.key }"
        @click="currentFilter = t.key"
      >
        <div class="text-2xl mb-1">{{ t.icon }}</div>
        <div class="text-sm font-medium">{{ t.label }}</div>
      </button>
    </div>
  </div>
</template>
