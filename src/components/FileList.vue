<script setup>
const props = defineProps({
  files: { type: Array, default: () => [] },
})
const emit = defineEmits(['remove', 'clear'])

function getFileIcon(name) {
  const ext = name.split('.').pop().toLowerCase()
  const icons = { docx: '📝', doc: '📝', pdf: '📕', xlsx: '📊', xls: '📊', pptx: '📊' }
  return icons[ext] || '📄'
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}
</script>

<template>
  <div class="glass-card rounded-2xl p-6 space-y-3">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-800">已选择的文件</h3>
      <button v-if="files.length > 0" class="text-sm text-red-500 hover:text-red-600 font-medium" @click="emit('clear')">
        清除全部
      </button>
    </div>
    <div v-if="files.length === 0" class="text-gray-400 text-center py-8">暂无文件</div>
    <div v-for="(file, index) in files" :key="file.name" class="file-card rounded-lg p-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="text-2xl">{{ getFileIcon(file.name) }}</div>
        <div>
          <p class="font-medium text-gray-800">{{ file.name }}</p>
          <p class="text-sm text-gray-500">{{ formatSize(file.size) }}</p>
        </div>
      </div>
      <button class="text-gray-400 hover:text-red-500 transition-colors p-2" @click="emit('remove', index)">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  </div>
</template>
