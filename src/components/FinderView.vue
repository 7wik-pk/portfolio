<script setup>
import { ref, computed } from 'vue'
import { finderFiles, applicationsFolder, projectsFolder } from '../config/finder'
import sidebarHomeIcon from '../assets/icons/finder_sidebar/Home.ico'
import sidebarAppsIcon from '../assets/icons/finder_sidebar/Applications.ico'
import sidebarProjectsIcon from '../assets/icons/finder_sidebar/3D.ico'
import searchIcon from '../assets/icons/finder_sidebar/Search.ico'

const currentPath = ref([]) // Stack of folder objects
const selectedFile = ref(null)

const emit = defineEmits(['launch-file', 'launch-app', 'show-toast'])

const currentFiles = computed(() => {
  if (currentPath.value.length === 0) {
    return finderFiles
  }
  return currentPath.value[currentPath.value.length - 1].children || []
})

const selectFile = (file) => {
  // Mobile behavior: Tap selected item to open
  if (selectedFile.value?.id === file.id && window.innerWidth <= 768) {
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
    selectedFile.value = null
  } else if (file.kind === 'Link') {
    window.open(file.url, '_blank')
  } else if (file.kind === 'App') {
    emit('launch-app', file.action)
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
  let folder = null
  if (id === 'apps') folder = applicationsFolder
  if (id === 'projects') folder = projectsFolder
  // if (id === 'downloads') folder = downloadsFolder
  
  // Find in finderFiles if not one of the majors
  if (!folder) {
    folder = finderFiles.find(f => f.id === id)
  }

  if (folder) {
    currentPath.value = [folder]
    selectedFile.value = null
  }
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
          :class="{ active: currentPath.length === 0 }" 
          @click="goToRoot"
        >
          <span class="sidebar-icon">
            <img :src="sidebarHomeIcon" alt="Home" class="sidebar-img-icon" />
          </span>
          <span class="sidebar-label">Home</span>
        </div>
        <div 
          class="sidebar-item" 
          :class="{ active: currentPath.length === 1 && currentPath[0].id === 'apps' }" 
          @click="goToFolder('apps')"
        >
          <span class="sidebar-icon">
            <img :src="sidebarAppsIcon" alt="Applications" class="sidebar-img-icon" />
          </span>
          <span class="sidebar-label">Applications</span>
        </div>
        <div 
          class="sidebar-item" 
          :class="{ active: currentPath.length === 1 && currentPath[0].id === 'projects' }" 
          @click="goToFolder('projects')"
        >
          <span class="sidebar-icon">
            <img :src="sidebarProjectsIcon" alt="Projects" class="sidebar-img-icon" />
          </span>
          <span class="sidebar-label">Projects</span>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="finder-content-wrapper">
      <!-- Top Navigation Bar -->
      <div class="finder-nav">
        <div class="nav-buttons">
          <button class="nav-btn" :disabled="currentPath.length === 0" @click="goBack">
            <span class="icon">◀</span>
          </button>
          <button class="nav-btn" disabled>
            <span class="icon">▶</span>
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
            @dblclick="openFile(file)"
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
  gap: 12px;
}

.nav-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:disabled {
  color: rgba(255, 255, 255, 0.2);
  cursor: default;
}

.nav-btn:not(:disabled):hover {
  background: rgba(255, 255, 255, 0.1);
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
}

.breadcrumb-item {
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
}

.breadcrumb-item:hover {
  background: rgba(255, 255, 255, 0.1);
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
  color: rgba(255, 255, 255, 0.8);
}

.sidebar-item:hover {
  background: rgba(255, 255, 255, 0.05);
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
