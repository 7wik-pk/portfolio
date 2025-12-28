<template>
  <div 
    class="desktop-icon" 
    :class="{ selected: isSelected }"
    @click.stop="handleClick"
    @dblclick.stop="handleDblClick"
  >
    <div class="icon-wrapper">
      <img v-if="item.image" :src="item.image" :alt="item.name" />
      <span v-else class="emoji">{{ item.emoji }}</span>
    </div>
    <div class="icon-label">{{ item.name }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select', 'launch'])

const lastTap = ref({ time: 0 })

const handleClick = () => {
  const now = Date.now()
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches
  
  // Selection
  emit('select', props.item.id)

  // Touch double tap detection
  if (isTouchDevice) {
    if (now - lastTap.value.time < 300) {
      emit('launch', props.item)
    }
  }
  lastTap.value.time = now
}

const handleDblClick = () => {
  emit('launch', props.item)
}
</script>

<style scoped>
.desktop-icon {
  width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border-radius: 6px;
  user-select: none;
  cursor: default;
  transition: background 0.2s ease;
}

.desktop-icon:hover {
  background: rgba(255, 255, 255, 0.1);
}


.icon-wrapper {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.4));
  transition: transform 0.2s ease;
}

.desktop-icon.selected .icon-wrapper {
  filter: brightness(0.7) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.4));
}

.icon-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.emoji {
  font-size: 48px;
}

.icon-label {
  color: #fff;
  font-size: 11.5px;
  font-weight: bold;
  text-align: center;
  /* Dual layer shadow: one crisp, one soft glow for contrast */
  text-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.9),
    0 0 10px rgba(0, 0, 0, 0.5);
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  word-break: break-word;
  padding: 2px 5px;
  border-radius: 4px;
  line-height: 1.25;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: background 0.1s ease;
}

.desktop-icon.selected .icon-label {
  background: #0063e1; /* macOS Selection Blue */
  text-shadow: none;
}
</style>
