<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import MenuBar from './components/MenuBar.vue'
import Dock from './components/Dock.vue'
import AppDrawer from './components/AppDrawer.vue'
import Window from './components/Window.vue'
import Preview from './views/Preview.vue'
import FinderView from './views/FinderView.vue'
import Toast from './components/Toast.vue'
import StickyNote from './components/StickyNote.vue'
import DesktopIcon from './components/DesktopIcon.vue'
import InfoView from './views/InfoView.vue'
import SetupAssistantView from './views/SetupAssistantView.vue'
import SettingsView from './views/SettingsView.vue'
import VSCodeView from './views/VSCodeView.vue'
import { contentMap, sidebarFavorites } from './config/finder'

const drawerOpen = ref(false)
const currentWallpaper = ref('')

// Mobile Detection
const isMobile = ref(false)
const disclaimerVisible = ref(true)
const selectedDesktopIcon = ref(null)

const checkMobile = () => {
  // Mobile if width is small (phones/tablets) OR if height is very small (landscape phones)
  isMobile.value = window.innerWidth <= 1024 || window.innerHeight <= 600
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

const showToast = (message = "That isn't ready just yet, apologies...") => {
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
    // Update core window properties if provided
    if (config.width) existing.width = config.width
    if (config.height) existing.height = config.height
    if (config.title) existing.title = config.title
    if (config.resizable !== undefined) existing.resizable = config.resizable
    
    // Update props if new ones are explicitly passed
    if (config.props && Object.keys(config.props).length > 0) {
      existing.props = { ...existing.props, ...config.props }
    }
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
  info: InfoView,
  setup: SetupAssistantView,
  settings: SettingsView,
  vscode: VSCodeView
}

const defaultTitle = "Sathwik's Portfolio"

const activeAppName = computed(() => {
  if (windowStack.value.length === 0) return defaultTitle
  const activeId = windowStack.value[windowStack.value.length - 1]
  const win = openWindows.value.find(w => w.id === activeId)
  if (!win) return defaultTitle
  
  // Return App Names
  if (win.component === 'finder') return "Finder"
  if (win.component === 'preview') return "Preview"
  if (win.component === 'info') return "About Me"
  
  return win.title
})

// File Menu Logic
const isFileDisabled = computed(() => {
  return windowStack.value.length === 0
})

// Load all wallpapers eagerly
const wallpapers = import.meta.glob('./assets/img/walls/*.{png,jpg,jpeg,webp,JPG,PNG}', { eager: true })
const rawWallpapers = Object.values(wallpapers).map(m => m.default)

const wallpaperList = computed(() => {
  return rawWallpapers.map(path => {
    // Extract filename from path
    const filename = path.split('/').pop().split('.')[0]
    // Clean up name (remove underscores, hyphens, capitalize)
    const name = filename
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
    return { name, path }
  })
})

const handleWallpaperChange = (path) => {
  if (path === currentWallpaper.value) return
  currentWallpaper.value = path
}

onMounted(() => {
  const randomIndex = Math.floor(Math.random() * rawWallpapers.length)
  currentWallpaper.value = rawWallpapers[randomIndex]
  
  checkMobile()
  window.addEventListener('resize', checkMobile)

  // Auto-launch 'About Me' for a welcoming first impression
  setTimeout(() => {
    handleLaunch(contentMap['about-me'])
  }, 800)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

const openDrawer = () => {
  drawerOpen.value = !drawerOpen.value
}

const handleLaunch = (item) => {
  // 1. Handle External Links
  if (item.actionType === 'link') {
    window.open(item.actionPayload, '_blank')
    return
  }

  // 2. Handle System Commands
  if (item.actionType === 'command') {
    if (item.actionPayload === 'toggle-drawer') {
      openDrawer()
    } else if (item.actionPayload === 'open-finder') {
      launchWindow({
        id: 'finder',
        title: 'Finder',
        component: 'finder',
        width: '900px',
        height: '600px',
        props: {}
      })
    } else if (item.actionPayload === 'open-techstack') {
      launchWindow({
        id: 'techstack',
        title: 'Visual Studio Code',
        component: 'vscode',
        width: '90vw',
        height: '80vh',
        props: {}
      })
    } else {
      showToast()
    }
    
    if (item.actionPayload !== 'toggle-drawer') drawerOpen.value = false
    return
  }

  // 3. Handle Content Shortcuts (Pinned items in Dock/Launchpad)
  if (item.actionType === 'content') {
    const content = contentMap[item.actionPayload]
    if (content) handleLaunch(content)
    drawerOpen.value = false
    return
  }

  // 4. Handle Actual Files and Folders
  if (item.kind === 'Folder') {
    const favorite = sidebarFavorites.find(f => f.id === item.id)
    const initialPath = favorite ? [...favorite.path] : [item]

    launchWindow({
      id: 'finder',
      title: 'Finder',
      component: 'finder',
      width: '900px',
      height: '600px',
      props: { initialPath }
    })
  } else if (item.kind === 'Settings') {
    launchWindow({
      id: item.id,
      title: item.name,
      component: 'settings',
      width: '800px',
      height: '600px',
      props: item.settingsProps
    })
  } else if (item.kind === 'Setup') {
    launchWindow({
      id: item.id,
      title: item.name,
      component: 'setup',
      width: '800px',
      height: '600px',
      props: item.setupProps
    })
  } else if (item.kind === 'Info') {
    launchWindow({
      id: item.id,
      title: item.name,
      component: 'info',
      width: '640px',
      height: '420px',
      resizable: false,
      props: item.infoProps
    })
  } else {
    // Media/Document Preview
    if (!item.srcPath) {
      showToast()
      return
    }
    
    launchWindow({
      id: `preview-${item.id}`, // Stable window ID per file!
      title: item.name,
      component: 'preview',
      props: { src: item.srcPath, title: item.name }
    })
  }
}
const handleInfoAction = (action, config) => {
  if (action === 'email') {
    handleLaunch({ actionType: 'link', actionPayload: `mailto:${config.email}` })
  } else if (action === 'resume') {
    handleLaunch(contentMap['resume'])
  } else if (action === 'download-resume') {
    window.open(contentMap['resume'].srcPath, '_blank')
  } else if (action === 'education') {
    handleLaunch(contentMap['education'])
  } else if (action === 'my-life') {
    handleLaunch(contentMap['my-life'])
  }
}

const handleStickyLink = (action) => {
  if (action === 'about') {
    handleLaunch(contentMap['about-me'])
  }
}

const handleMenuAction = (action) => {
  if (action === 'about') {
    handleLaunch(contentMap['about-me'])
  } else if (action === 'source') {
    handleLaunch(contentMap['source-code'])
  } else if (action === 'close-window') {
    const activeId = windowStack.value[windowStack.value.length - 1]
    if (activeId) {
      closeWindow(activeId)
    }
  }
}
</script>

<template>
  <div class="macos-container">
    <Transition name="wallpaper-fade">
      <div 
        :key="currentWallpaper" 
        class="wallpaper-layer" 
        :style="{ backgroundImage: `url(${currentWallpaper})` }"
      ></div>
    </Transition>

    <MenuBar 
      :active-app-name="activeAppName"
      :is-file-disabled="isFileDisabled"
      :wallpapers="wallpaperList"
      :current-wallpaper="currentWallpaper"
      @menu-click="showToast()"
      @action="handleMenuAction"
      @change-wallpaper="handleWallpaperChange"
    />
    
    <div class="desktop" @click="selectedDesktopIcon = null">
      <AppDrawer v-if="drawerOpen" @launch-app="handleLaunch" @open-drawer="openDrawer" />
      
      <!-- Desktop Icons -->
      <div class="desktop-icons">
        <DesktopIcon
          v-for="item in contentMap.desktop.children"
          :key="item.id"
          :item="item"
          :is-selected="selectedDesktopIcon === item.id"
          @select="id => selectedDesktopIcon = id"
          @launch="handleLaunch"
        />
      </div>
      
      <!-- Dynamic Windows -->
      <Window 
        v-for="win in openWindows"
        :key="win.id"
        :is-open="true"
        :title="win.title"
        :width="win.width"
        :height="win.height"
        :resizable="win.resizable"
        :is-focused="windowStack[windowStack.length - 1] === win.id"
        :style="{ zIndex: getZIndex(win.id) }"
        @close="closeWindow(win.id)"
        @mousedown="bringToFront(win.id)"
      >
        <component 
          :is="windowComponents[win.component]" 
          v-bind="win.props"
          @launch-file="handleLaunch"
          @launch-app="handleLaunch"
          @button-click="action => handleInfoAction(action, win.props)"
          @show-toast="showToast"
          @close="closeWindow(win.id)"
        />
      </Window>
    </div>

    <!-- Sticky Notes Container -->
    <div :class="{ 'sticky-stack': isMobile }">
      <!-- Welcome Note -->
      <StickyNote 
        v-if="stickyNoteVisible"
        :initial-x="40"
        :initial-y="60"
        :z-index="stickyNoteZIndex"
        :is-stacked="isMobile"
        @close="closeStickyNote"
        @link-click="handleStickyLink"
      />

      <!-- Mobile Disclaimer Note -->
      <StickyNote 
        v-if="isMobile && disclaimerVisible"
        :initial-x="40"
        :initial-y="450"
        :z-index="1500"
        :show-portrait="false"
        :is-stacked="isMobile"
        initial-content="<strong>Note:</strong><br><br>This portfolio <strong>should be viewed on a PC screen</strong> for the best experience.<br>[It is also responsive to some degree.]"
        @close="closeDisclaimer"
      />
    </div>

    <Dock 
      :active-app-ids="openWindows.map(w => w.id.startsWith('preview-') ? w.id.replace('preview-', '') : w.id)"
      @launch-app="handleLaunch" 
    />

    <Toast :show="toast.show" :message="toast.message" @close="toast.show = false" />
  </div>
</template>

