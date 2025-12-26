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
const currentWallpaper = ref('')

// Dynamic Window Registry
const openWindows = ref([])
// Use a simple array for stacking order
const windowStack = ref([])

const bringToFront = (id) => {
  windowStack.value = windowStack.value.filter(item => item !== id)
  windowStack.value.push(id)
}

const getZIndex = (id) => {
  return 2000 + windowStack.value.indexOf(id)
}

const launchWindow = (config) => {
  const existing = openWindows.value.find(w => w.id === config.id)
  if (!existing) {
    openWindows.value.push(config)
  } else {
    // Update props if already open (important for Preview)
    existing.props = config.props
    existing.title = config.title
  }
  bringToFront(config.id)
}

const closeWindow = (id) => {
  openWindows.value = openWindows.value.filter(w => w.id !== id)
  windowStack.value = windowStack.value.filter(item => item !== id)
}

// Map IDs to components for dynamic rendering
const windowComponents = {
  finder: FinderView,
  preview: Preview,
  resume: Preview // Resume uses Preview component
}

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
    // Auto-close drawer on app launch (except for the toggle itself if it's already handling it)
    drawerOpen.value = false
    
    switch (app.actionPayload) {
      case 'toggle-drawer':
        openDrawer()
        break;
      case 'open-resume':
        launchWindow({
          id: 'resume',
          title: 'sathwik_general_resume.pdf',
          component: 'resume',
          props: { src: resumePdf, title: 'Resume' }
        })
        break;
      case 'open-finder':
        launchWindow({
          id: 'finder',
          title: 'Finder',
          component: 'finder',
          width: '900px',
          height: '600px',
          props: {}
        })
        break;
      default:
        break;
    }
  }
}

const handleFileLaunch = (file) => {
  launchWindow({
    id: 'preview',
    title: file.name,
    component: 'preview',
    props: { src: file.srcPath, title: file.name }
  })
}
</script>

<template>
  <div class="macos-container" :style="{ backgroundImage: `url(${currentWallpaper})` }">
    <MenuBar />
    
    <div class="desktop">
      <AppDrawer v-if="drawerOpen" @launch-app="handleAppLaunch" @open-drawer="openDrawer" />
      
      <!-- Dynamic Windows -->
      <Window 
        v-for="win in openWindows"
        :key="win.id"
        :is-open="true"
        :title="win.title"
        :width="win.width"
        :height="win.height"
        :style="{ zIndex: getZIndex(win.id) }"
        @close="closeWindow(win.id)"
        @mousedown="bringToFront(win.id)"
      >
        <component 
          :is="windowComponents[win.component]" 
          v-bind="win.props"
          @launch-file="handleFileLaunch"
          @launch-app="handleAppLaunch"
        />
      </Window>
    </div>

    <Dock 
      :active-app-ids="openWindows.map(w => w.id)"
      @launch-app="handleAppLaunch" 
    />
  </div>
</template>

