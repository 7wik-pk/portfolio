<script setup>
import { ref, onMounted } from 'vue'
import MenuBar from './components/MenuBar.vue'
import Dock from './components/Dock.vue'
import AppDrawer from './components/AppDrawer.vue'
import Window from './components/Window.vue'
import Preview from './components/Preview.vue'
import FinderView from './components/FinderView.vue'
import resumePdf from './assets/docs/sathwik_general_resume.pdf'

const drawerOpen = ref(false)
const resumeOpen = ref(false)
const finderOpen = ref(false)
const currentWallpaper = ref('')

const activePreview = ref({
  src: '',
  title: '',
  isOpen: false
})

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
      case 'toggle-drawer':
        openDrawer()
        break;
      case 'open-resume':
        resumeOpen.value = true
        break;
      case 'open-finder':
        finderOpen.value = true
        break;
      default:
        break;
    }
  }
}

const handleFileLaunch = (file) => {
  activePreview.value = {
    src: file.srcPath,
    title: file.name,
    isOpen: true
  }
}
</script>

<template>
  <div class="macos-container" :style="{ backgroundImage: `url(${currentWallpaper})` }">
    <MenuBar />
    
    <div class="desktop">
      <AppDrawer v-if="drawerOpen" @launch-app="handleAppLaunch" @open-drawer="openDrawer" />
      
      <!-- Windows -->
      <Window 
        :is-open="resumeOpen" 
        title="sathwik_general_resume.pdf" 
        @close="resumeOpen = false"
      >
        <Preview :src="resumePdf" title="Resume" />
      </Window>

      <Window 
        :is-open="finderOpen" 
        title="Finder" 
        width="900px"
        height="600px"
        @close="finderOpen = false"
      >
        <FinderView @launch-file="handleFileLaunch" />
      </Window>

      <!-- Generic Preview Window -->
      <Window 
        :is-open="activePreview.isOpen" 
        :title="activePreview.title"
        @close="activePreview.isOpen = false"
      >
        <Preview :src="activePreview.src" :title="activePreview.title" />
      </Window>
    </div>

    <Dock @launch-app="handleAppLaunch" />
  </div>
</template>

