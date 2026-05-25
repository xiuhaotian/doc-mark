<script setup>
import { computed } from 'vue'

const props = defineProps({
  markdown: { type: String, default: '' },
  fileName: { type: String, default: '' },
})

async function copy() {
  if (!props.markdown) return
  try {
    await navigator.clipboard.writeText(props.markdown)
  } catch {}
}

function download() {
  if (!props.markdown) return
  const blob = new Blob([props.markdown], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = props.fileName || 'converted.md'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="glass-card rounded-2xl overflow-hidden">
    <div class="bg-gray-800 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="flex gap-1.5">
          <div class="w-3 h-3 rounded-full bg-red-500"></div>
          <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div class="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span class="text-gray-300 font-medium">Markdown 预览</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-gray-400 text-sm">{{ fileName }}</span>
        <button class="text-gray-400 hover:text-white transition-colors p-2" title="复制" @click="copy">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
        </button>
        <button class="text-gray-400 hover:text-white transition-colors p-2" title="下载" @click="download">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
        </button>
      </div>
    </div>
    <div class="preview-container h-[600px] overflow-auto p-6">
      <pre class="text-sm">{{ markdown || '转换后的 Markdown 内容将显示在这里...' }}</pre>
    </div>
  </div>
</template>
