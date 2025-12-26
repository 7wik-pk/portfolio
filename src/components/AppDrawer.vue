<template>
  <div class="drawer-overlay" @click.self="openDrawer">
    <div class="drawer">
      <div class="drawer-header">
        <div class="drawer-title">Applications</div>
        <button class="drawer-close" @click="openDrawer">✕</button>
      </div>
      <div class="drawer-content">
        <div 
          v-for="(app, index) in drawerApps" 
          :key="index"
          class="drawer-app"
          @click="handleAppClick(app)"
        >
          <div class="drawer-app-icon">
            <img v-if="app.image" :src="app.image" :alt="app.name" class="drawer-image-icon" />
            <span v-else>{{ app.emoji }}</span>
          </div>
          <div class="drawer-app-name">{{ app.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { apps } from '../config/apps'
const drawerApps = apps.filter(app => app.showInDrawer)
const emit = defineEmits(['launch-app', 'open-drawer'])

const handleAppClick = (app) => {
  emit('launch-app', app)
}

const openDrawer = () => {
  emit('open-drawer')
}
</script>

<style scoped>
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.drawer {
  width: 90%;
  max-width: 800px;
  max-height: 85vh;
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border-radius: 20px;
  border: 0.5px solid rgba(255, 255, 255, 0.15);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  overflow: hidden;
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.1);
}

.drawer-title {
  font-size: 15px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif;
  letter-spacing: -0.01em;
}

.drawer-close {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.drawer-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
}

.drawer-content {
  padding: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 20px;
  overflow-y: auto;
  max-height: calc(85vh - 80px);
}

.drawer-app {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 12px;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.drawer-app:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.drawer-app-icon {
  font-size: 48px;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
  transition: transform 0.2s ease;
}

.drawer-app:hover .drawer-app-icon {
  transform: scale(1.1);
}

.drawer-image-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.drawer-app-name {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif;
  text-align: center;
  font-weight: 400;
  letter-spacing: -0.01em;
}

@media (max-width: 768px) {
  .drawer {
    width: 95%;
  }
  .drawer-content {
    padding: 16px;
    grid-template-columns: repeat(auto-fill, minmax(75px, 1fr));
    gap: 12px;
  }
  .drawer-app {
    padding: 8px 4px;
    gap: 4px;
  }
  .drawer-app-icon {
    font-size: 36px;
  }
  .drawer-app-name {
    font-size: 11px;
  }
}

.drawer-content::-webkit-scrollbar {
  width: 8px;
}

.drawer-content::-webkit-scrollbar-track {
  background: transparent;
}

.drawer-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.drawer-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>

