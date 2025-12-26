<template>
  <div class="macos-container" :style="{ backgroundImage: `url(${currentWallpaper})` }">
    <MenuBar />
    <div class="desktop">
      <AppDrawer v-if="drawerOpen" @launch-app="handleAppLaunch" @open-drawer="openDrawer" />
    </div>
    <Dock @launch-app="handleAppLaunch" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MenuBar from './components/MenuBar.vue'
import Dock from './components/Dock.vue'
import AppDrawer from './components/AppDrawer.vue'

const drawerOpen = ref(false)
const currentWallpaper = ref('')

// Load all wallpapers eagerly
const wallpapers = import.meta.glob('./assets/img/walls/*.{png,jpg,jpeg,webp,JPG,PNG}', { eager: true })
const wallPaths = Object.values(wallpapers).map(m => m.default)

onMounted(() => {
  const randomIndex = Math.floor(Math.random() * wallPaths.length)
  currentWallpaper.value = wallPaths[randomIndex]
})

const openDrawer = () => {
  drawerOpen.value = !drawerOpen.value
}

const handleAppLaunch = (app) => {
  if (app.actionType === 'link') {
    window.open(app.actionPayload, '_blank')
  } else if (app.actionType === 'command') {

    switch (app.actionPayload) {
      // Add all command handlers here as needed
      case 'toggle-drawer':
        openDrawer()
        break;
      case 'open-resume':
        // window.open('https://drive.google.com/file/d/1Z7wik-pk/view?usp=sharing', '_blank')
        break;
      default:
        break;
    }
    
  }
}
</script>

