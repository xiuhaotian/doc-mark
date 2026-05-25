<script setup>
const emit = defineEmits(['files-selected'])

function onDrop(e) {
  e.preventDefault()
  e.currentTarget.classList.remove('dragover')
  emit('files-selected', e.dataTransfer.files)
}

function onDragOver(e) {
  e.preventDefault()
  e.currentTarget.classList.add('dragover')
}

function onDragLeave(e) {
  e.currentTarget.classList.remove('dragover')
}

function onFileInput(e) {
  emit('files-selected', e.target.files)
  e.target.value = ''
}
</script>

<template>
  <div class="glass-card rounded-2xl p-8">
    <div
      class="drop-zone rounded-xl p-12 text-center cursor-pointer"
      @click="$refs.fileInput.click()"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <div class="mb-4">
        <svg class="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
        </svg>
      </div>
      <p class="text-lg font-medium text-gray-700 mb-2">拖拽文件到此处</p>
      <p class="text-sm text-gray-500 mb-4">或点击选择文件</p>
      <p class="text-xs text-gray-400">支持 .docx, .pdf, .xlsx, .xls, .pptx 文件</p>
    </div>
    <input ref="fileInput" type="file" class="hidden" accept=".docx,.pdf,.xlsx,.xls,.pptx" multiple @change="onFileInput">
  </div>
</template>
