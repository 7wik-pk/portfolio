<template>
  <div class="preview-container">
    <iframe v-if="isPdf" :src="pdfUrl" class="preview-content pdf"></iframe>
    <div v-else class="preview-content image">
      <img :src="src" :alt="title" />
    </div>

    <!-- Floating Download Button for PDFs -->
    <div v-if="isPdf" class="preview-actions">
      <a 
        class="download-btn" 
        :href="src" 
        target="_blank" 
        @click.stop
        title="Open in New Tab / Download"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        <span>Open in a new tab</span>
      </a>
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

const handleDownload = () => {
  window.open(props.src, '_blank')
}
</script>

<style scoped>
.preview-container {
  width: 100%;
  height: 100%;
  background: #1e1e1e;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
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

.preview-actions {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  pointer-events: auto;
}

.download-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: rgba(40, 40, 40, 0.75);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 0.5px solid rgba(255, 255, 255, 0.15);
  color: white;
  padding: 10px 24px;
  border-radius: 10px;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 15px;
  font-weight: 510;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  text-decoration: none;
}

@media (hover: hover) {
  .download-btn:hover {
    background: rgba(30, 30, 30, 0.9);
  }
}

.download-btn:active {
  background: rgba(20, 20, 20, 1);
  transform: scale(0.98);
}

.download-btn svg {
  width: 18px;
  height: 18px;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
}

/* On mobile, keep it center and prominent */
@media (max-width: 480px) {
  .preview-actions {
    bottom: 16px;
    width: 85%;
    display: flex;
    justify-content: center;
  }
  
  .download-btn {
    width: 100%;
    justify-content: center;
    padding: 14px 20px;
    font-size: 15px;
    border-radius: 12px;
  }
}
</style>
