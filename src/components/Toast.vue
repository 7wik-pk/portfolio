<template>
  <Transition name="toast">
    <div v-if="show" class="toast-container">
      <div class="toast-content">
        <div class="toast-icon">
          <img :src="toolsIcon" alt="Tools" class="toast-img-icon" />
        </div>
        <div class="toast-text">
          <div class="toast-title">Still a work in progress!</div>
          <div class="toast-message">{{ message }}</div>
        </div>
      </div>
      <button class="toast-close" @click="$emit('close')" aria-label="Close notification">
        <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup>
import toolsIcon from '../assets/icons/finder_sidebar/Tools.ico'

defineProps({
  show: Boolean,
  message: String
})

defineEmits(['close'])
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 40px;
  right: 20px;
  width: 320px;
  background: rgba(40, 40, 40, 0.7);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: 12px;
  border: 0.5px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  z-index: 9999;
  padding: 12px;
  pointer-events: auto;
}

.toast-container:hover .toast-close {
  opacity: 1;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toast-icon {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-img-icon {
  width: 22px;
  height: 22px;
  object-fit: contain;
}

.toast-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.toast-title {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
}

.toast-message {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
  line-height: 1.4;
}

.toast-close {
  position: absolute;
  top: -8px;
  left: -8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(80, 80, 80, 0.9);
  backdrop-filter: blur(10px);
  border: 0.5px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s ease;
  padding: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.toast-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.toast-close svg {
  opacity: 0.8;
}

/* Transition */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.toast-enter-from {
  transform: translateX(100%) scale(0.9);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
