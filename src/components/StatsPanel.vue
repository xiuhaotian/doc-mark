<script setup>
import { computed } from 'vue'

const props = defineProps({
  markdown: { type: String, default: '' },
})

const stats = computed(() => ({
  chars: props.markdown.length,
  lines: props.markdown.split('\n').length,
  words: props.markdown.split(/\s+/).filter(w => w.length > 0).length,
}))
</script>

<template>
  <div class="glass-card rounded-2xl p-6">
    <div class="grid grid-cols-3 gap-4 text-center">
      <div>
        <div class="text-3xl font-bold text-gray-800">{{ stats.chars }}</div>
        <div class="text-sm text-gray-500">字符数</div>
      </div>
      <div>
        <div class="text-3xl font-bold text-gray-800">{{ stats.lines }}</div>
        <div class="text-sm text-gray-500">行数</div>
      </div>
      <div>
        <div class="text-3xl font-bold text-gray-800">{{ stats.words }}</div>
        <div class="text-sm text-gray-500">单词数</div>
      </div>
    </div>
  </div>
</template>
