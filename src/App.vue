<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import MenuBar from './components/MenuBar.vue'
import Dock from './components/Dock.vue'
import AppDrawer from './components/AppDrawer.vue'
import Window from './components/Window.vue'
import Preview from './components/Preview.vue'
import FinderView from './components/FinderView.vue'
import Toast from './components/Toast.vue'
import StickyNote from './components/StickyNote.vue'
import resumePdf from './assets/docs/sathwik_general_resume.pdf'

const drawerOpen = ref(false)
const currentWallpaper = ref('')

// Mobile Detection
const isMobile = ref(false)
const disclaimerVisible = ref(true)

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

const closeDisclaimer = () => {
  disclaimerVisible.value = false
}

// Dynamic Window Registry
const openWindows = ref([])
// Use a simple array for stacking order
const windowStack = ref([])

// Sticky Note State
const stickyNoteVisible = ref(true)
const stickyNoteZIndex = ref(1500) // Fixed z-index below windows (which start at 2000)

const bringToFront = (id) => {
  windowStack.value = windowStack.value.filter(item => item !== id)
  windowStack.value.push(id)
}

const getZIndex = (id) => {
  return 2000 + windowStack.value.indexOf(id)
}

const closeStickyNote = () => {
  stickyNoteVisible.value = false
}

// Toast System
const toast = ref({
  show: false,
  message: '',
  timeoutId: null
})

const showToast = (message) => {
  // Clear any existing timeout to avoid conflicting disappearance
  if (toast.value.timeoutId) {
    clearTimeout(toast.value.timeoutId)
    toast.value.timeoutId = null
  }

  // Reset if already showing to re-trigger animation
  if (toast.value.show) {
    toast.value.show = false
    // Delay slightly to allow Vue to notice the state change
    setTimeout(() => {
      toast.value.message = message
      toast.value.show = true
      startToastTimer()
    }, 10)
  } else {
    toast.value.message = message
    toast.value.show = true
    startToastTimer()
  }
}

const startToastTimer = () => {
  toast.value.timeoutId = setTimeout(() => {
    toast.value.show = false
    toast.value.timeoutId = null
  }, 3000)
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

const defaultTitle = "Sathwik's Portfolio"

const activeAppName = computed(() => {
  if (windowStack.value.length === 0) return defaultTitle
  const activeId = windowStack.value[windowStack.value.length - 1]
  const win = openWindows.value.find(w => w.id === activeId)
  if (!win) return defaultTitle
  
  // Return App Names
  if (win.component === 'finder') return "Finder"
  if (win.component === 'resume' || win.component === 'preview') return "Preview"
  
  return win.title
})

// Load all wallpapers eagerly
const wallpapers = import.meta.glob('./assets/img/walls/*.{png,jpg,jpeg,webp,JPG,PNG}', { eager: true })
const wallPaths = Object.values(wallpapers).map(m => m.default)

onMounted(() => {
  const randomIndex = Math.floor(Math.random() * wallPaths.length)
  currentWallpaper.value = wallPaths[randomIndex]
  
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
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
        showToast("That isn't ready just yet, apologies...")
        break;
    }
    
    // Auto-close drawer for all actions except toggle-drawer
    if (app.actionPayload !== 'toggle-drawer') {
      drawerOpen.value = false
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
    <MenuBar 
      :active-app-name="activeAppName" 
      @menu-click="showToast('That isn\'t ready just yet, apologies...')"
    />
    
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
        :is-focused="windowStack[windowStack.length - 1] === win.id"
        :style="{ zIndex: getZIndex(win.id) }"
        @close="closeWindow(win.id)"
        @mousedown="bringToFront(win.id)"
      >
        <component 
          :is="windowComponents[win.component]" 
          v-bind="win.props"
          @launch-file="handleFileLaunch"
          @launch-app="handleAppLaunch"
          @show-toast="showToast"
        />
      </Window>
    </div>

    <!-- Sticky Note -->
    <StickyNote 
      v-if="stickyNoteVisible"
      :initial-x="40"
      :initial-y="60"
      :z-index="stickyNoteZIndex"
      @close="closeStickyNote"
    />

    <!-- Mobile Disclaimer Note -->
    <StickyNote 
      v-if="isMobile && disclaimerVisible"
      :initial-x="40"
      :initial-y="450"
      :z-index="1500"
      :show-portrait="false"
      initial-content="<strong>Note:</strong><br><br>Although this portfolio is responsive to some degree, it should be viewed on a tablet or PC screen for the best experience."
      @close="closeDisclaimer"
    />

    <Dock 
      :active-app-ids="openWindows.map(w => w.id)"
      @launch-app="handleAppLaunch" 
    />

    <Toast :show="toast.show" :message="toast.message" @close="toast.show = false" />
  </div>
</template>

