<script setup>
import { ref, computed } from 'vue'
import FileUpload from './components/FileUpload.vue'
import FileList from './components/FileList.vue'
import FileTypeFilter from './components/FileTypeFilter.vue'
import PreviewPanel from './components/PreviewPanel.vue'
import StatsPanel from './components/StatsPanel.vue'
import Toast from './components/Toast.vue'
import { convertFile } from './composables/useFileConversion'
import { useToast } from './composables/useToast'

const { toasts, showToast } = useToast()

const selectedFiles = ref([])
const currentMarkdown = ref('')
const currentFileName = ref('')
const converting = ref(false)

const hasFiles = computed(() => selectedFiles.value.length > 0)

function handleFiles(files) {
  const validTypes = ['.docx', '.pdf', '.xlsx', '.xls', '.pptx']
  const newFiles = Array.from(files).filter(file => {
    const ext = '.' + file.name.split('.').pop().toLowerCase()
    return validTypes.includes(ext)
  })
  newFiles.forEach(file => {
    if (!selectedFiles.value.find(f => f.name === file.name)) {
      selectedFiles.value.push(file)
    }
  })
}

function removeFile(index) {
  selectedFiles.value.splice(index, 1)
}

function clearAll() {
  selectedFiles.value = []
  currentMarkdown.value = ''
  currentFileName.value = ''
}

async function startConvert() {
  if (selectedFiles.value.length === 0) return
  converting.value = true

  try {
    let combinedMarkdown = ''
    for (let i = 0; i < selectedFiles.value.length; i++) {
      const file = selectedFiles.value[i]
      const markdown = await convertFile(file)
      if (selectedFiles.value.length > 1) {
        combinedMarkdown += `# ${file.name}\n\n`
      }
      combinedMarkdown += markdown
      combinedMarkdown += '\n\n---\n\n'
    }

    currentMarkdown.value = combinedMarkdown.trim()
    currentFileName.value = selectedFiles.value.length === 1
      ? selectedFiles.value[0].name.replace(/\.[^/.]+$/, '') + '.md'
      : 'converted.md'

    showToast('转换成功！')
  } catch (error) {
    showToast('转换失败：' + error.message, 'error')
  } finally {
    converting.value = false
  }
}
</script>

<template>
  <div class="p-4 md:p-8">
    <div class="max-w-6xl mx-auto">
      <header class="text-center mb-12 fade-in">
        <h1 class="text-5xl md:text-6xl font-bold text-white mb-4">DocuMark</h1>
        <p class="text-xl text-white/80 mb-2">智能文档转 Markdown 工具</p>
        <p class="text-white/60">支持 Word · PDF · Excel · PowerPoint 在线转换</p>
      </header>

      <div class="grid lg:grid-cols-2 gap-8">
        <div class="space-y-6 fade-in">
          <div class="glass-card rounded-2xl p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">功能特点</h2>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex items-center gap-3">
                <div class="feature-icon w-10 h-10 rounded-lg flex items-center justify-center text-white">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-700">极速转换</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="feature-icon w-10 h-10 rounded-lg flex items-center justify-center text-white">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-700">隐私安全</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="feature-icon w-10 h-10 rounded-lg flex items-center justify-center text-white">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-700">直接下载</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="feature-icon w-10 h-10 rounded-lg flex items-center justify-center text-white">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-700">格式保留</span>
              </div>
            </div>
          </div>

          <FileUpload @files-selected="handleFiles" />

          <FileTypeFilter />

          <FileList
            :files="selectedFiles"
            @remove="removeFile"
            @clear="clearAll"
          />

          <button
            class="btn-primary w-full py-4 rounded-xl text-white font-semibold text-lg disabled:opacity-50 flex items-center justify-center gap-3"
            :disabled="!hasFiles || converting"
            @click="startConvert"
          >
            <span v-if="!converting">开始转换</span>
            <div v-else class="flex items-center gap-2">
              <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>转换中...</span>
            </div>
          </button>
        </div>

        <div class="space-y-6 fade-in">
          <PreviewPanel
            :markdown="currentMarkdown"
            :fileName="currentFileName"
          />

          <StatsPanel :markdown="currentMarkdown" />

          <div class="glass-card rounded-2xl p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">💡 使用提示</h3>
            <ul class="space-y-2 text-sm text-gray-600">
              <li class="flex items-start gap-2">
                <span class="text-green-500 mt-0.5">✓</span>
                <span>Word 文档会保留标题、列表、表格等格式</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-green-500 mt-0.5">✓</span>
                <span>Excel 文件会转换为 Markdown 表格格式</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-green-500 mt-0.5">✓</span>
                <span>PDF 支持文本提取，扫描版 PDF 效果有限</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-green-500 mt-0.5">✓</span>
                <span>所有处理均在本地完成，文件不会上传至服务器</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <footer class="text-center mt-12 text-white/60 text-sm">
        <p>© 2024 DocuMark · 纯本地处理，保护您的隐私安全</p>
      </footer>
    </div>
  </div>

  <Toast :toasts="toasts" />
</template>
