<template>
  <div 
    v-if="isVisible"
    class="sticky-note"
    :class="{ 'is-stacked': isStacked }"
    :style="isStacked ? { zIndex: zIndex } : { 
      top: `${position.y}px`,
      left: `${position.x}px`,
      zIndex: zIndex
    }"
  >
    <div class="sticky-header" @mousedown="startDragging">
      <button class="sticky-close" @click="close" aria-label="Close note">×</button>
    </div>
    
    <div class="sticky-content">
      <div 
        class="sticky-text"
        contenteditable="true"
        spellcheck="false"
        @mousedown.stop
        @click="handleContentClick"
        v-html="content"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  initialX: {
    type: Number,
    default: 50
  },
  initialY: {
    type: Number,
    default: 100
  },
  zIndex: {
    type: Number,
    default: 1500
  },
  initialContent: {
    type: String,
    default: `<strong>Welcome to my portfolio! 👋</strong><br><br>I'm <span class="sticky-link" data-action="about">Sathwik</span>, and I've built this interactive macOS-style portfolio to showcase my work.<br><br>Feel free to explore the Finder, check out my resume, and see what I've been working on.<br><br>Enjoy your visit!`
  },
  showPortrait: {
    type: Boolean,
    default: true
  },
  isStacked: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'link-click'])

const isVisible = ref(true)
const position = ref({ x: props.initialX, y: props.initialY })
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })

const content = ref(props.initialContent)

const handleContentClick = (e) => {
  const target = e.target
  if (target.classList.contains('sticky-link')) {
    e.preventDefault()
    emit('link-click', target.dataset.action)
  }
}

const close = () => {
  isVisible.value = false
  emit('close')
}

const startDragging = (e) => {
  if (e.button !== 0 || props.isStacked) return
  
  isDragging.value = true
  dragStart.value = {
    x: e.clientX - position.value.x,
    y: e.clientY - position.value.y
  }
  
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDragging)
}

const onDrag = (e) => {
  if (!isDragging.value) return
  
  position.value = {
    x: e.clientX - dragStart.value.x,
    y: e.clientY - dragStart.value.y
  }
}

const stopDragging = () => {
  isDragging.value = false
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDragging)
}

onUnmounted(() => {
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDragging)
})
</script>

<style scoped>
.sticky-note {
  position: fixed;
  width: 320px;
  background: linear-gradient(135deg, #fef9e7 0%, #fef5d4 100%);
  border-radius: 4px;
  box-shadow: 
    0 8px 24px rgba(0, 0, 0, 0.15),
    0 2px 8px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.08);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
  cursor: default;
  user-select: none;
}

.sticky-note.is-stacked {
  position: relative !important;
  top: 0 !important;
  left: 0 !important;
  width: 280px;
  margin-bottom: 12px;
}

.sticky-header {
  height: 24px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 4px 8px;
  cursor: move;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.sticky-close {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.5);
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  padding: 0;
}

.sticky-close:hover {
  background: rgba(0, 0, 0, 0.2);
  color: rgba(0, 0, 0, 0.8);
}

.sticky-content {
  padding: 8px 16px 16px 16px;
}

.sticky-text {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  outline: none;
  cursor: text;
  user-select: text;
  min-height: 20px;
}

:deep(.sticky-link) {
  color: #007aff;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
}

:deep(.sticky-link:hover) {
  text-decoration: underline;
}

.sticky-text strong {
  font-weight: 600;
  color: #222;
}

.sticky-text:focus {
  outline: none;
}

/* Subtle paper texture effect */
.sticky-note::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 1px,
      rgba(0, 0, 0, 0.01) 1px,
      rgba(0, 0, 0, 0.01) 2px
    );
  pointer-events: none;
  border-radius: 4px;
}
</style>
