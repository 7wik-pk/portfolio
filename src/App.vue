<template>
  <div class="macos-container" :style="{ backgroundImage: `url(${currentWallpaper})` }">
    <MenuBar />
    <div class="desktop">
      <AppDrawer v-if="drawerOpen" />
    </div>
    <Dock @open-drawer="openDrawer" />
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

</script>

