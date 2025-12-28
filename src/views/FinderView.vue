<script setup>
import { ref, computed, watch } from 'vue'
import { finderFiles, sidebarFavorites } from '../config/finder'
import sidebarHomeIcon from '../assets/icons/finder_sidebar/Home.ico'
import searchIcon from '../assets/icons/finder_sidebar/Search.ico'

const props = defineProps({
  initialPath: {
    type: Array,
    default: () => []
  }
})

const currentPath = ref([...props.initialPath]) // Stack of folder objects

watch(() => props.initialPath, (newVal) => {
  currentPath.value = [...newVal]
}, { deep: true })
const selectedFile = ref(null)
const lastTap = ref({ id: null, time: 0 })

const emit = defineEmits(['launch-file', 'launch-app', 'show-toast'])

const currentFiles = computed(() => {
  if (currentPath.value.length === 0) {
    return finderFiles
  }
  return currentPath.value[currentPath.value.length - 1].children || []
})

const selectFile = (file) => {
  const now = Date.now()
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches
  const timeDiff = now - lastTap.value.time
  
  // Double tap detection (within 300ms)
  if (lastTap.value.id === file.id && timeDiff < 300) {
    openFile(file)
    lastTap.value = { id: null, time: 0 } // Reset
    return
  }

  // Update last tap
  lastTap.value = { id: file.id, time: now }

  // Selection logic for mobile/tablet (tap once to select, another tap to open if selected)
  // This is a fallback/alternative to the time-based double tap
  if (selectedFile.value?.id === file.id && (window.innerWidth <= 1366 || isTouchDevice)) {
    openFile(file)
    return
  }
  
  selectedFile.value = file
}

const deselect = () => {
  selectedFile.value = null
}

const openFile = (file) => {
  if (file.kind === 'Folder') {
    currentPath.value.push(file)
  } else {
    emit('launch-file', file)
  }
}

const goBack = () => {
  currentPath.value.pop()
  selectedFile.value = null
}

const goToBreadcrumb = (index) => {
  currentPath.value = currentPath.value.slice(0, index + 1)
  selectedFile.value = null
}

const goToRoot = () => {
  currentPath.value = []
  selectedFile.value = null
}

const goToFolder = (id) => {
  const favorite = sidebarFavorites.find(f => f.id === id)
  if (favorite) {
    currentPath.value = [...favorite.path]
    selectedFile.value = null
    return
  }

  // Fallback for folders not in favorites
  const folder = finderFiles.find(f => f.id === id)
  if (folder) {
    currentPath.value = [folder]
    selectedFile.value = null
  }
}

const isSidebarActive = (id) => {
  if (id === 'home') return currentPath.value.length === 0
  
  // Check if this favorite's ID is in the current path
  const isInPath = currentPath.value.some(f => f.id === id)
  if (!isInPath) return false

  // If it is in path, check if any of its children that are ALSO favorites are in the path
  // (e.g., if Projects is in path, don't highlight Desktop)
  const childFavorites = sidebarFavorites.filter(fav => {
    // A favorite is a 'child' if its path starts with our path but is longer
    const favPath = sidebarFavorites.find(f => f.id === id).path
    return fav.id !== id && 
           fav.path.length > favPath.length && 
           fav.path.every((p, i) => i >= favPath.length || p.id === favPath[i].id)
  })

  const isAnyChildFavoriteActive = childFavorites.some(child => 
    currentPath.value.some(f => f.id === child.id)
  )

  return !isAnyChildFavoriteActive
}
</script>

<template>
  <div class="finder-view">
    <!-- Sidebar -->
    <div class="finder-sidebar">
      <div class="sidebar-section">
        <div class="sidebar-title">Favorites</div>
        <div 
          class="sidebar-item" 
          :class="{ active: isSidebarActive('home') }" 
          @click="goToRoot"
        >
          <span class="sidebar-icon">
            <img :src="sidebarHomeIcon" alt="Home" class="sidebar-img-icon" />
          </span>
          <span class="sidebar-label">Home</span>
        </div>
        
        <div 
          v-for="fav in sidebarFavorites"
          :key="fav.id"
          class="sidebar-item" 
          :class="{ active: isSidebarActive(fav.id) }" 
          @click="goToFolder(fav.id)"
        >
          <span class="sidebar-icon">
            <img :src="fav.icon" :alt="fav.name" class="sidebar-img-icon" />
          </span>
          <span class="sidebar-label">{{ fav.name }}</span>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="finder-content-wrapper">
      <!-- Top Navigation Bar -->
      <div class="finder-nav">
        <div class="nav-buttons">
          <button class="nav-btn" :disabled="currentPath.length === 0" @click="goBack" aria-label="Go back">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button class="nav-btn" disabled aria-label="Go forward">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
        
        <div class="breadcrumbs">
          <div class="breadcrumb-item" @click="goToRoot">Home</div>
          <template v-for="(folder, index) in currentPath" :key="folder.id">
            <div class="breadcrumb-separator">›</div>
            <div class="breadcrumb-item" @click="goToBreadcrumb(index)">{{ folder.name }}</div>
          </template>
        </div>

        <div class="finder-search">
          <span class="search-icon" @click="emit('show-toast', undefined)">
            <img :src="searchIcon" alt="Search" width="12" height="12" /></span>
          <input 
            type="text" 
            placeholder="Search" 
            @click="emit('show-toast', undefined)"
            readonly
          />
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="finder-main" @click.self="deselect">
        <div class="finder-grid">
          <div 
            v-for="file in currentFiles" 
            :key="file.id"
            class="file-item"
            :class="{ selected: selectedFile?.id === file.id }"
            @click.stop="selectFile(file)"
          >
            <div class="file-icon">
              <img v-if="file.image" :src="file.image" :alt="file.name" class="finder-image-icon" />
              <span v-else>{{ file.emoji }}</span>
            </div>
            <div class="file-name">{{ file.name }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Details Pane -->
    <div class="finder-details" v-if="selectedFile">
      <div class="details-preview">
        <div class="large-icon">
          <img v-if="selectedFile.image" :src="selectedFile.image" :alt="selectedFile.name" class="finder-image-icon" />
          <span v-else>{{ selectedFile.emoji }}</span>
        </div>
      </div>
      <div class="details-info">
        <div class="details-name">{{ selectedFile.name }}</div>
        <div class="details-type">{{ selectedFile.type }}</div>
        
        <div class="details-divider"></div>
        
        <div class="details-row">
          <span class="row-label">Kind</span>
          <span class="row-value">{{ selectedFile.kind }}</span>
        </div>
        <div class="details-row">
          <span class="row-label">Size</span>
          <span class="row-value">{{ selectedFile.size }}</span>
        </div>
        <div class="details-row">
          <span class="row-label">Modified</span>
          <span class="row-value">{{ selectedFile.lastModified }}</span>
        </div>
      </div>
    </div>
    <div class="finder-details empty" v-else>
      <div class="no-selection">Select a file or folder to view its information.</div>
    </div>
  </div>
</template>

<style scoped>
.finder-view {
  display: flex;
  height: 100%;
  background: rgba(30, 30, 30, 0.6);
  color: #fff;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
}

.finder-content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Nav Bar */
.finder-nav {
  height: 52px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 20px;
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.1);
}

.nav-buttons {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 2px;
  gap: 0;
  border: 0.5px solid rgba(255, 255, 255, 0.1);
}

.nav-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.nav-btn:disabled {
  color: rgba(255, 255, 255, 0.15);
  cursor: default;
}

@media (hover: hover) {
  .nav-btn:not(:disabled):hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
}

.nav-btn:not(:disabled):active {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(0.95);
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
}

.breadcrumb-item {
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
}

@media (hover: hover) {
  .breadcrumb-item:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

.breadcrumb-separator {
  color: rgba(255, 255, 255, 0.3);
}

/* Search Bar */
.finder-search {
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 4px 8px;
  gap: 6px;
  width: 180px;
}

.search-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  cursor: pointer;
}

.finder-search input {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 13px;
  width: 100%;
  outline: none;
  cursor: pointer;
}

.finder-search input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

/* Sidebar */
.finder-sidebar {
  width: 180px;
  background: rgba(255, 255, 255, 0.05);
  border-right: 0.5px solid rgba(255, 255, 255, 0.1);
  padding: 12px 0;
}

.sidebar-section {
  padding: 0 12px;
}

.sidebar-title {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 8px;
  padding-left: 8px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
}

@media (hover: hover) {
  .sidebar-item:hover {
    background: rgba(255, 255, 255, 0.05);
  }
}

.sidebar-item.active {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.sidebar-img-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
  opacity: 0.8;
}

.sidebar-item.active .sidebar-img-icon {
  opacity: 1;
}

/* Main Content */
.finder-main {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.finder-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 20px;
}

.file-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border-radius: 6px;
  cursor: default;
  user-select: none;
}

.file-item.selected {
  background: rgba(0, 122, 255, 0.3);
}

.file-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 54px;
}

.file-name {
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.finder-image-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Details Pane */
.finder-details {
  width: 240px;
  background: rgba(255, 255, 255, 0.03);
  border-left: 0.5px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
}

.details-preview {
  height: 160px;
  display: flex;
  margin-top: 10px;
  align-items: center;
  justify-content: center;
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.1);
}

.large-icon {
  width: 160px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 100px;
}

.details-info {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.details-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 2px;
}

.details-type {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
}

.details-divider {
  height: 0.5px;
  background: rgba(255, 255, 255, 0.1);
  margin: 4px 0;
}

.details-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.row-label {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
}

.row-value {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
}

.finder-details.empty {
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
  color: rgba(255, 255, 255, 0.3);
  font-size: 13px;
}

@media (max-width: 768px) {
  .finder-sidebar, .finder-details {
    display: none;
  }
}
</style>
