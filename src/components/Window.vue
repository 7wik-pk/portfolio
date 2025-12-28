<template>
  <div v-if="isOpen" class="window-overlay">
    <div 
      class="window" 
      :style="{ 
        width: width, 
        height: height,
        transform: `translate(${position.x}px, ${position.y}px)`
      }"
    >
      <div class="window-titlebar" @mousedown="startDragging">
        <div class="traffic-lights">
          <button class="light close" @click="close"></button>
          <button class="light minimize" @click="close"></button>
          <button class="light maximize disabled"></button>
        </div>
        <div class="window-title">{{ title }}</div>
      </div>
      <div class="window-content">
        <slot></slot>
      </div>
      <!-- Focus Guard: Captures clicks on inactive windows with iframes -->
      <div v-if="!isFocused" class="focus-guard"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  isFocused: {
    type: Boolean,
    default: true
  },
  title: String,
  width: {
    type: String,
    default: '80%'
  },
  height: {
    type: String,
    default: '80%'
  }
})

const emit = defineEmits(['close'])

const position = ref({ x: 0, y: 0 })
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })

const close = () => {
  emit('close')
}

const startDragging = (e) => {
  // Only drag if left mouse button is clicked and not on traffic lights
  if (e.button !== 0 || e.target.classList.contains('light')) return
  
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
.window-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: inherit;
  pointer-events: none;
}

.window {
  background: rgba(30, 30, 30, 0.85);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border-radius: 12px;
  border: 0.5px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: window-appear 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: auto;
  max-height: 80%;
  max-width: 85%;
}

@keyframes window-appear {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.window-titlebar {
  height: 38px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  padding: 0 12px;
  position: relative;
  user-select: none;
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.1);
}

.traffic-lights {
  display: flex;
  gap: 8px;
  z-index: 10;
}

.light {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
}

.light.close { background: #ff5f57; }
.light.minimize { background: #ffbd2e; }
.light.maximize { background: #28c941; }
.light.maximize.disabled {
  background: #28c94133;
  cursor: default;
  pointer-events: none;
}

.window-title {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 13px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
}

.window-content {
  flex: 1;
  overflow: auto;
  background: rgba(255, 255, 255, 0.02);
}

.focus-guard {
  position: absolute;
  top: 38px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  cursor: default;
  background: transparent;
}

@media (max-width: 1366px) {
  .window {
    width: 85% !important;
    height: 75% !important;
  }
}
</style>
