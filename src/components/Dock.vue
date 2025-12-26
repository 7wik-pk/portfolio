<template>
  <div class="dock-container">
    <div class="dock">
      <div 
        v-for="(app, index) in dockApps" 
        :key="index"
        class="dock-item"
        :class="{ 
          'dock-item-separator': app.separator, 
          'hide-on-mobile': app.hideOnMobile,
          'bouncing': bouncingApps.has(app.id)
        }"
        @click="handleAppClick(app)"
      >
        <div v-if="!app.separator" class="dock-icon-wrapper">
          <div class="dock-label">{{ app.name }}</div>
          <div class="dock-icon">
            <img v-if="app.image" :src="app.image" :alt="app.name" class="dock-image-icon" />
            <span v-else>{{ app.emoji }}</span>
          </div>
          <div 
            class="dock-indicator"
            :class="{ 'active': activeAppIds.includes(app.id) }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { apps } from '../config/apps'

const props = defineProps({
  activeAppIds: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['launch-app'])

const bouncingApps = ref(new Set())

const dockApps = apps.filter(app => app.showInDock)

const handleAppClick = (app) => {
  if (app.separator) return

  const isAlreadyOpen = props.activeAppIds.includes(app.id)
  const isLaunchpad = app.actionPayload === 'toggle-drawer'

  // Only bounce if NOT open and NOT launchpad
  if (!isAlreadyOpen && !isLaunchpad) {
    bouncingApps.value.add(app.id)
    setTimeout(() => {
      bouncingApps.value.delete(app.id)
    }, 600)
  }

  // Only delay if NOT open and NOT launchpad
  if (!isAlreadyOpen && !isLaunchpad) {
    setTimeout(() => {
      emit('launch-app', app)
    }, 300)
  } else {
    emit('launch-app', app)
  }
}
</script>

<style scoped>
.dock-container {
  --icon-size: 56px;
  --icon-margin: 6px;
  --dock-padding: 4px;
  --label-scale: 1;

  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding-bottom: 4px;
  z-index: 999;
  pointer-events: none;
  transition: z-index 0s;
}

.dock-container:hover {
  z-index: 10000;
}

@media (max-width: 1400px) {
  .dock-container {
    --icon-size: 48px;
    --icon-margin: 4px;
  }
}

@media (max-width: 768px) {
  .dock-container {
    --icon-size: 38px;
    --icon-margin: 3px;
  }
  .hide-on-mobile {
    display: none !important;
  }
}

.dock {
  display: flex;
  align-items: flex-end;
  padding: 0 var(--dock-padding);
  background: rgba(30, 30, 30, 0.4);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border-radius: 18px;
  border: 0.5px solid rgba(255, 255, 255, 0.15);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  pointer-events: auto;
}

.dock-item {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.dock-label {
  position: absolute;
  top: -45px;
  background: rgba(30, 30, 30, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  color: #fff;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 400;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
  transform: translateY(10px);
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
}

@media (max-width: 768px) {
  .dock-label {
    display: none;
  }
}

.dock-item:hover .dock-label {
  opacity: 1;
  transform: translateY(0);
}

.dock-item-separator {
  width: 1px;
  height: 48px;
  background: rgba(255, 255, 255, 0.15);
  margin: 0 4px;
  pointer-events: none;
}

.dock-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dock-icon {
  width: var(--icon-size);
  height: var(--icon-size);
  border-radius: 12px;
  margin: var(--icon-margin);
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  overflow: hidden;
}

.dock-image-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.dock-indicator {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.dock-indicator.active {
  opacity: 1;
}

@media (max-width: 768px) {
  .dock-indicator {
    display: none;
  }
}

.dock-item:hover .dock-icon {
  transform: scale(1.3) translateY(-8px);
}

@media (max-width: 1024px) {
  .dock-item:hover .dock-icon {
    transform: scale(1.15) translateY(-4px);
  }
}

.dock-item:hover .dock-indicator {
  opacity: 1;
}

.dock-item:active .dock-icon {
  transform: scale(1.2) translateY(-6px);
}

/* Bounce Animation */
.dock-item.bouncing .dock-icon {
  animation: dock-bounce 0.6s cubic-bezier(0.28, 0.84, 0.42, 1);
}

@keyframes dock-bounce {
  0%, 100% { transform: translateY(0); }
  30% { transform: translateY(-34px); }
  50% { transform: translateY(0); }
  70% { transform: translateY(-8px); }
}
</style>

