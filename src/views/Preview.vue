<template>
  <div class="preview-container">
    <iframe v-if="isPdf" :src="pdfUrl" class="preview-content pdf"></iframe>
    <div v-else class="preview-content image">
      <img :src="src" :alt="title" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  src: String,
  title: String
})

const isPdf = computed(() => {
  return props.src && props.src.toLowerCase().endsWith('.pdf')
})

const pdfUrl = computed(() => {
  if (!isPdf.value) return props.src
  // Append #view=FitH to fit to width by default
  return `${props.src}#view=FitH`
})
</script>

<style scoped>
.preview-container {
  width: 100%;
  height: 100%;
  background: #1e1e1e;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-content {
  width: 100%;
  height: 100%;
  border: none;
}

.preview-content.image {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
}

.preview-content.image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.pdf {
  background: white;
}
</style>
