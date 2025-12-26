<template>
  <div class="menu-bar">
    <div class="menu-bar-left">
      <div class="apple-logo"><img src="../assets/icons/apple-16.ico" alt="Apple Logo" /></div>
      <div class="menu-item finder">Finder</div>
      <div class="menu-item">File</div>
      <div class="menu-item">Edit</div>
      <div class="menu-item">View</div>
      <div class="menu-item">Go</div>
      <div class="menu-item">Window</div>
      <div class="menu-item">Help</div>
    </div>
    <div class="menu-bar-right">
      <!-- ideas: linkedin, github, email icons with links -->
      <!-- <div class="menu-icon">🔋</div> -->
      <!-- <div class="menu-icon">📶</div> -->
      <div class="menu-icon">🔍</div>
      <!-- <div class="menu-icon">🔔</div> -->
      <div class="control-center"><img src="../assets/icons/control-center.png" alt="Control Center" width="16" height="16" /></div>
      <div class="time">{{ currentTime }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

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
  z-index: 1000;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif;
  font-weight: 400;
  letter-spacing: -0.01em;
}

.menu-bar-left {
  display: flex;
  align-items: center;
  gap: 2px;
}

.apple-logo {
  padding-left: 0.4rem;
  font-size: 16px;
  opacity: 0.9;
  cursor: default;
}

.menu-item {
  padding: 4px 8px;
  border-radius: 4px;
  cursor: default;
  transition: background-color 0.15s ease;
  user-select: none;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
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
  cursor: default;
}

.finder {
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif;
  font-weight: bold;
}

.control-center {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: default;
  opacity: 0.85;
}

.time {
  /* padding: 0 4px; */
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.01em;
  opacity: 0.9;
  white-space: pre;
}
</style>

