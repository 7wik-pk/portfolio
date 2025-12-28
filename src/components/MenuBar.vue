<template>
  <div class="menu-bar">
    <div class="menu-bar-left">
      <div 
        class="apple-logo" 
        :class="{ active: activeMenu === 'apple' }"
        @click.stop="toggleMenu('apple')"
      >
        <img src="../assets/icons/apple-16.ico" alt="Apple Logo" />
        <div v-show="activeMenu === 'apple'" class="dropdown-menu">
          <div class="dropdown-item" @click.stop="handleAction('about')">About Me</div>
          <div class="dropdown-separator"></div>
          <div class="dropdown-item" @click.stop="handleAction('source')">Source Code</div>
        </div>
      </div>
      <div class="menu-item active-app">{{ activeAppName }}</div>
      <div 
        class="menu-item" 
        :class="{ active: activeMenu === 'file', disabled: isFileDisabled }"
        @click.stop="toggleMenu('file')"
      >
        File
        <div v-show="activeMenu === 'file'" class="dropdown-menu">
          <div class="dropdown-item" @click.stop="handleAction('close-window')">Close Window</div>
        </div>
      </div>
    </div>
    <div class="menu-bar-right">

      <div class="menu-icon search" @click="emit('menu-click')">
        <img :src="searchIcon" alt="Search" width="16" height="16" />
      </div>

      <div 
        class="control-center"
        :class="{ active: activeMenu === 'control-center' }"
        @click.stop="toggleMenu('control-center')"
      >
        <img src="../assets/icons/control-center.png" alt="Control Center" width="16" height="16" />

        <div
          v-show="activeMenu === 'control-center'"
          class="dropdown-menu control-center-menu expandable"
        >
          <!-- Change Wallpaper trigger -->
          <div
            class="dropdown-item has-submenu"
            :class="{ active: showWallpaperMenu }"
            @click.stop="showWallpaperMenu = !showWallpaperMenu"
          >
            Change Wallpaper
            <span class="submenu-arrow" :class="{ rotated: showWallpaperMenu }">›</span>
          </div>

          <!-- EXPANDING section -->
          <div
            class="wallpaper-expand"
            :class="{ open: showWallpaperMenu }"
          >
            <div
              v-for="wp in wallpapers"
              :key="wp.path"
              class="dropdown-item wallpaper-option"
              :class="{ selected: wp.path === currentWallpaper }"
              :title="wp.name"
              @click.stop="handleWallpaperSelect(wp.path)"
            >
              <div
                class="wallpaper-thumb"
                :style="{ backgroundImage: `url(${wp.path})` }"
              >
                <div v-if="wp.path === currentWallpaper" class="wallpaper-check">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              </div>
              <span class="wallpaper-label">{{ wp.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="time">{{ currentTime }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import searchIcon from '../assets/icons/finder_sidebar/Search.ico'

const emit = defineEmits(['menu-click', 'action', 'change-wallpaper'])
const activeMenu = ref(null)
const showWallpaperMenu = ref(false)

const toggleMenu = (menu) => {
  if (menu === 'file' && props.isFileDisabled) return
  activeMenu.value = activeMenu.value === menu ? null : menu
}

const closeMenu = () => {
  activeMenu.value = null
  showWallpaperMenu.value = false
}

const handleAction = (action) => {
  emit('action', action)
  closeMenu()
}

const handleWallpaperSelect = (path) => {
  emit('change-wallpaper', path)
  // Don't close menu immediately, let user see it changed? Or close? 
  // Native behavior usually keeps it open or closes. Let's close for now.
  closeMenu()
}

onMounted(() => {
  window.addEventListener('click', closeMenu)
})

onUnmounted(() => {
  window.removeEventListener('click', closeMenu)
})

const props = defineProps({
  activeAppName: {
    type: String,
    default: 'Finder'
  },
  isFileDisabled: {
    type: Boolean,
    default: false
  },
  wallpapers: {
    type: Array,
    default: () => []
  },
  currentWallpaper: {
    type: String,
    default: ''
  }
})

const currentTime = ref('')

const updateTime = () => {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][now.getMonth()]
  const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()]
  const AM_PM = now.getHours() < 12 ? 'AM' : 'PM'
  const hours12 = now.getHours() % 12 || 12

  currentTime.value = `${dayOfWeek} ${month} ${day}   ${hours12}:${minutes} ${AM_PM}`
}

let timeInterval = null

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped>
.menu-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 28px;
  background: rgba(30, 30, 30, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
  z-index: 9999;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif;
  font-weight: 500;
  letter-spacing: -0.01em;
}

.menu-bar-left {
  display: flex;
  align-items: center;
  gap: 2px;
}

.menu-item {
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease;
  user-select: none;
  position: relative;
}

.apple-logo {
  position: relative;
  padding: 4px 10px;
  border-radius: 4px;
}

.apple-logo:hover, .apple-logo.active {
  background-color: rgba(255, 255, 255, 0.1);
}

.menu-item:hover, .menu-item.active {
  background-color: rgba(255, 255, 255, 0.1);
}

.menu-item.disabled {
  opacity: 0.5;
  cursor: default;
  pointer-events: none;
}

.control-center.active {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  top: 28px;
  left: 0;
  width: 220px;
  background: rgba(30, 30, 30, 0.85);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border-radius: 6px;
  border: 0.5px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  padding: 5px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  z-index: 2000;
}

.control-center-menu {
  right: 0;
  left: auto; /* Align to right for control center */
  width: 260px;
  max-height: 400px;
  overflow-y: auto;
}

.menu-section-title {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.4);
  padding: 8px 10px 4px;
  text-transform: uppercase;
}

.wallpaper-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 8px;
}

.wallpaper-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
}

.wallpaper-preview {
  width: 100%;
  aspect-ratio: 16/10;
  background-size: cover;
  background-position: center;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.wallpaper-name {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

.dropdown-item {
  padding: 4px 10px;
  border-radius: 4px;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@media (hover: hover) {
  .dropdown-item:hover {
    background: #007aff;
    color: white;
  }
}

.dropdown-separator {
  height: 1px;
  background: rgba(255, 255, 255, 0.15);
  margin: 4px 6px;
}

.menu-bar-right {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-right: 8px;
}

.menu-icon {
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-icon img {
  opacity: 0.85;
}

.menu-icon.search img {
  opacity: 0.9;
  filter: brightness(0) invert(1);
}

.active-app {
  font-weight: bold;
}

.control-center {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
}

.control-center img {
  opacity: 0.85;
}

/* Allow menu to grow */
.control-center-menu.expandable {
  padding-bottom: 4px;
  z-index: 9999;
}

/* Expanding wallpaper section */
.wallpaper-expand {
  overflow-y: auto;
  max-height: 0;
  transition: max-height 0.25s ease;
  background: rgba(0, 0, 0, 0.2);
  margin: 0 -5px;
  padding: 0 5px;
}

/* When open, expand responsively */
.wallpaper-expand.open {
  max-height: min(40vh, 320px);
}

.wallpaper-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 15px; /* Indent */
  justify-content: flex-start;
}

.wallpaper-option.selected {
  background: rgba(255, 255, 255, 0.05);
}

@media (hover: hover) {
  .wallpaper-option:hover {
    background: #007aff;
  }
}

/* Thumbnail */
.wallpaper-thumb {
  width: 72px;
  height: 48px;
  background-size: cover;
  background-position: center;
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  flex-shrink: 0;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wallpaper-option.selected .wallpaper-thumb {
  border-color: #007aff;
  filter: brightness(0.7);
}

.wallpaper-check {
  color: #fff;
  filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.8));
}

.wallpaper-label {
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.has-submenu {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.submenu-arrow {
  font-size: 16px;
  transition: transform 0.2s ease;
  opacity: 0.6;
}

.submenu-arrow.rotated {
  transform: rotate(90deg);
}

/* RESPONSIVENESS */
@media (max-width: 480px) {
  .wallpaper-expand.open {
    max-height: 22vh; /* ~2–3 items */
  }
}

@media (min-width: 768px) {
  .wallpaper-expand.open {
    max-height: 45vh; /* many items */
  }
}

.time {
  /* padding: 0 4px; */
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.01em;
  opacity: 0.9;
  white-space: pre;
}
@media (max-width: 768px) {
  .menu-item {
    display: none;
  }
  
  .menu-bar-right {
    gap: 10px;
  }
  
  .time {
    font-size: 12px;
  }
}
</style>

