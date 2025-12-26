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
      <!-- ideas: linkedin, github, email icons with links -->
      <!-- <div class="menu-icon">🔋</div> -->
      <!-- <div class="menu-icon">📶</div> -->
      <div class="menu-icon search" @click="emit('menu-click')">
        <img :src="searchIcon" alt="Search" width="16" height="16" />
      </div>
      <!-- <div class="menu-icon">🔔</div> -->
      <div class="control-center" @click="emit('menu-click')"><img src="../assets/icons/control-center.png" alt="Control Center" width="16" height="16" /></div>
      <div class="time">{{ currentTime }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import searchIcon from '../assets/icons/finder_sidebar/Search.ico'


const emit = defineEmits(['menu-click', 'action'])
const activeMenu = ref(null)

const toggleMenu = (menu) => {
  if (menu === 'file' && props.isFileDisabled) return
  activeMenu.value = activeMenu.value === menu ? null : menu
}

const closeMenu = () => {
  activeMenu.value = null
}

const handleAction = (action) => {
  emit('action', action)
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
  font-weight: 400;
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

/* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  top: 28px;
  left: 0;
  width: 220px;
  background: rgba(40, 40, 40, 0.95);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: 6px;
  border: 0.5px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  padding: 5px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  z-index: 2000;
}

.dropdown-item {
  padding: 4px 10px;
  border-radius: 4px;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.dropdown-item:hover {
  background: #007aff;
  color: white;
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
  opacity: 0.85;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
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
  opacity: 0.85;
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

