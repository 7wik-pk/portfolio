<template>
  <div v-if="isOpen" class="window-overlay" @click.self="close">
    <div class="window" :style="{ width: width, height: height }">
      <div class="window-titlebar">
        <div class="traffic-lights">
          <button class="light close" @click="close"></button>
          <button class="light minimize"></button>
          <button class="light maximize"></button>
        </div>
        <div class="window-title">{{ title }}</div>
      </div>
      <div class="window-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpen: Boolean,
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

const close = () => {
  emit('close')
}
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
  z-index: 1100;
  pointer-events: auto;
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

.window-title {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
}

.window-content {
  flex: 1;
  overflow: auto;
  background: rgba(255, 255, 255, 0.02);
}

@media (max-width: 768px) {
  .window {
    width: 95% !important;
    height: 90% !important;
  }
}
</style>
