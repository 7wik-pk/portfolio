<script setup>
import { ref, computed, onMounted } from 'vue'
import { marked } from 'marked'

// Load all markdown files from the tech_skills directory
const skillFiles = import.meta.glob('../data/tech_skills/*.md', { query: '?raw', eager: true })

const files = computed(() => {
  const sidebarIcons = {
    '1_languages_and_frameworks.md': 'terminal',
    '2_domain_knowledge.md': 'book',
    '3_interested_in_learning.md': 'target'
  }

  return Object.entries(skillFiles).map(([path, module]) => {
    const filename = path.split('/').pop()
    const name = filename.replace(/^\d+_/, '').replace('.md', '').split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    const displayName = filename.replace(/^\d+_/, '')
    
    return {
      id: filename,
      name: displayName,
      title: name,
      content: module.default || module,
      path: path,
      sidebarIcon: sidebarIcons[filename] || 'markdown'
    }
  }).sort((a, b) => {
    return a.id.localeCompare(b.id)
  })
})

// Load all tech icons for path resolution
const techIcons = import.meta.glob('../assets/icons/tech_stack/*.{png,jpg,jpeg,svg,webp,ico}', { eager: true })

const activeFileId = ref('')
const openFileIds = ref([])

const activeFile = computed(() => {
  return files.value.find(f => f.id === activeFileId.value) || null
})

const renderedMarkdown = computed(() => {
  if (!activeFile.value) return ''
  let html = marked.parse(activeFile.value.content)
  
  // Minimal path resolution for Vite assets:
  // Supports both ![]() and <img> tags
  return html.replace(/(src|href)="(\.\.\/)*assets\/icons\/tech_stack\/(.*?)"/g, (match, attr, dots, filename) => {
    const key = Object.keys(techIcons).find(p => p.endsWith(filename))
    if (key) {
      return `${attr}="${techIcons[key].default}"`
    }
    return match
  })
})

const openFile = (id) => {
  activeFileId.value = id
  if (!openFileIds.value.includes(id)) {
    openFileIds.value.push(id)
  }
}

const closeFile = (id) => {
  openFileIds.value = openFileIds.value.filter(fid => fid !== id)
  if (activeFileId.value === id) {
    activeFileId.value = openFileIds.value.length > 0 ? openFileIds.value[openFileIds.value.length - 1] : ''
  }
}

onMounted(() => {
  if (files.value.length > 0) {
    openFile(files.value[0].id)
  }
})

const activeSidebarTab = ref('explorer')
</script>

<template>
  <div class="vscode-view">
    <!-- Activity Bar -->
    <div class="activity-bar">
      <div class="activity-top">
        <div 
          class="activity-item" 
          :class="{ active: activeSidebarTab === 'explorer' }"
          @click="activeSidebarTab = 'explorer'"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
          </svg>
        </div>
        <div class="activity-item disabled">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <div class="activity-item disabled">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="14.31" y1="8" x2="20.05" y2="17.94"></line>
            <line x1="9.69" y1="8" x2="21.17" y2="8"></line>
            <line x1="7.38" y1="12" x2="13.12" y2="2.06"></line>
            <line x1="9.69" y1="16" x2="3.95" y2="6.06"></line>
            <line x1="14.31" y1="16" x2="2.83" y2="16"></line>
            <line x1="16.62" y1="12" x2="10.88" y2="21.94"></line>
          </svg>
        </div>
        <div class="activity-item disabled">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        </div>
      </div>
      <div class="activity-bottom">
        <div class="activity-item disabled">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Sidebar Content -->
    <div class="sidebar">
      <div class="sidebar-header">
        <span>EXPLORER</span>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="1"></circle>
          <circle cx="19" cy="12" r="1"></circle>
          <circle cx="5" cy="12" r="1"></circle>
        </svg>
      </div>
      
      <div class="sidebar-section">
        <div class="section-title">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
          <span>TECH_SKILLS</span>
        </div>
        
        <div class="file-list">
          <div 
            v-for="file in files" 
            :key="file.id"
            class="file-item"
            :class="{ active: activeFileId === file.id }"
            @click="openFile(file.id)"
          >
            <span class="file-icon">
              <template v-if="file.sidebarIcon === 'terminal'">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="#31c354">
                  <path d="M2,4v16h20V4H2z M20,18H4V6h16V18z M6,10h5v2H6V10z M12,14h6v2h-6V14z"/>
                </svg>
              </template>
              <template v-else-if="file.sidebarIcon === 'book'">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="#cca700">
                  <path d="M19,2H5C3.3,2,2,3.3,2,5v14c0,1.7,1.3,3,3,3h14c1.7,0,3-1.3,3-3V5C22,3.3,20.7,2,19,2z M20,19c0,0.6-0.4,1-1,1H5c-0.6,0-1-0.4-1-1V5c0-0.6,0.4-1,1-1h14c0.6,0,1,0.4,1,1V19z M6,7h12v2H6V7z M6,11h12v2H6V11z M6,15h7v2H6V15z"/>
                </svg>
              </template>
              <template v-else-if="file.sidebarIcon === 'target'">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="#e37933">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                  <circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="2" fill="none"/>
                  <circle cx="12" cy="12" r="2" fill="currentColor"/>
                </svg>
              </template>
              <template v-else>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="#519aba">
                  <path d="M20,4H4C2.895,4,2,4.895,2,6v12c0,1.105,0.895,2,2,2h16c1.105,0,2-0.895,2-2V6C22,4.895,21.105,4,20,4z M12,15.5l-4-4l1.414-1.414L11,11.672V7h2v4.672l1.586-1.586L16,11.5L12,15.5z"/>
                </svg>
              </template>
            </span>
            <span class="file-name">{{ file.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Editor Area -->
    <div class="editor-area">
      <!-- Tabs -->
      <div class="tabs-container">
        <div 
          v-for="fid in openFileIds" 
          :key="fid"
          class="tab"
          :class="{ active: activeFileId === fid }"
          @click="openFile(fid)"
        >
          <span class="tab-icon">
             <template v-if="files.find(f => f.id === fid)?.sidebarIcon === 'terminal'">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="#31c354">
                  <path d="M2,4v16h20V4H2z M20,18H4V6h16V18z M6,10h5v2H6V10z M12,14h6v2h-6V14z"/>
                </svg>
              </template>
              <template v-else-if="files.find(f => f.id === fid)?.sidebarIcon === 'book'">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="#cca700">
                  <path d="M19,2H5C3.3,2,2,3.3,2,5v14c0,1.7,1.3,3,3,3h14c1.7,0,3-1.3,3-3V5C22,3.3,20.7,2,19,2z M20,19c0,0.6-0.4,1-1,1H5c-0.6,0-1-0.4-1-1V5c0-0.6,0.4-1,1-1h14c0.6,0,1,0.4,1,1V19z M6,7h12v2H6V7z M6,11h12v2H6V11z M6,15h7v2H6V15z"/>
                </svg>
              </template>
              <template v-else-if="files.find(f => f.id === fid)?.sidebarIcon === 'target'">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="#e37933">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                  <circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="2" fill="none"/>
                  <circle cx="12" cy="12" r="2" fill="currentColor"/>
                </svg>
              </template>
              <template v-else>
                <svg viewBox="0 0 24 24" width="12" height="12" fill="#519aba">
                  <path d="M20,4H4C2.895,4,2,4.895,2,6v12c0,1.105,0.895,2,2,2h16c1.105,0,2-0.895,2-2V6C22,4.895,21.105,4,20,4z M12,15.5l-4-4l1.414-1.414L11,11.672V7h2v4.672l1.586-1.586L16,11.5L12,15.5z"/>
                </svg>
              </template>
          </span>
          <span class="tab-name">{{ files.find(f => f.id === fid)?.name }}</span>
          <span class="tab-close" @click.stop="closeFile(fid)">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </span>
        </div>
      </div>

      <!-- Editor Content -->
      <div class="editor-content" v-if="activeFile">
        <div class="markdown-body" v-html="renderedMarkdown"></div>
      </div>
      <div class="editor-empty" v-else>
        <div class="vscode-logo">
           <svg viewBox="0 0 24 24" width="120" height="120" fill="rgba(255,255,255,0.05)">
            <path d="M23.15 2.58L17.62 1.28C16.89 1.11 16.14 1.45 15.83 2.1L8.53 17.1L1.45 12.1L2.1 11.45L2.58 12.1L8.53 16.29L15.83 1.28C16.14 0.63 16.89 0.29 17.62 0.46L23.15 1.76C23.67 1.88 24 2.34 24 2.87V21.13C24 21.66 23.67 22.12 23.15 22.24L17.62 23.54C16.89 23.71 16.14 23.37 15.83 22.72L8.53 7.72L1.45 12.72L2.1 13.37L2.58 12.72L8.53 8.53L15.83 23.54C16.14 24.19 16.89 24.53 17.62 24.36L23.15 23.06C23.67 22.94 24 22.48 24 21.95V2.87C24 2.34 23.67 1.88 23.15 1.76V2.58Z"/>
          </svg>
        </div>
      </div>

      <!-- Status Bar -->
      <div class="status-bar">
        <div class="status-left">
          <div class="status-item remote">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 18V6h16v12H4z"/>
            </svg>
          </div>
          <div class="status-item">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
            <span>master*</span>
          </div>
        </div>
        <div class="status-right">
          <div class="status-item">Ln 1, Col 1</div>
          <div class="status-item">Spaces: 2</div>
          <div class="status-item">UTF-8</div>
          <div class="status-item">Markdown</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vscode-view {
  display: flex;
  height: 100%;
  background: #1e1e1e;
  color: #cccccc;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  overflow: hidden;
}

/* Activity Bar */
.activity-bar {
  width: 48px;
  background: #333333;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.activity-item {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.4);
  position: relative;
}

.activity-item:hover {
  color: rgba(255, 255, 255, 0.8);
}

.activity-item.active {
  color: #fff;
  border-left: 2px solid #fff;
}

.activity-item.disabled {
  cursor: default;
  opacity: 0.5;
}

/* Sidebar */
.sidebar {
  width: 200px;
  background: #252526;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  font-size: 11px;
  color: #bbbbbb;
  font-weight: 500;
}

.sidebar-section {
  display: flex;
  flex-direction: column;
}

.section-title {
  height: 22px;
  background: #383838;
  display: flex;
  align-items: center;
  padding: 0 4px;
  font-size: 11px;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
}

.file-list {
  display: flex;
  flex-direction: column;
  padding: 4px 0;
}

.file-item {
  height: 22px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 6px;
  cursor: pointer;
  font-size: 13px;
  color: #cccccc;
}

.file-item:hover {
  background: #2a2d2e;
}

.file-item.active {
  background: #37373d;
  color: #fff;
}

.file-icon {
  display: flex;
  align-items: center;
}

/* Editor Area */
.editor-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
  position: relative;
}

.tabs-container {
  height: 35px;
  background: #252526;
  display: flex;
  overflow-x: auto;
}

.tabs-container::-webkit-scrollbar {
  display: none;
}

.tab {
  height: 35px;
  min-width: 120px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  background: #2d2d2d;
  border-right: 1px solid #252526;
  cursor: pointer;
  font-size: 12px;
  color: #969696;
  gap: 8px;
  position: relative;
}

.tab.active {
  background: #1e1e1e;
  color: #fff;
}

.tab:hover .tab-close {
  opacity: 1;
}

.tab-close {
  margin-left: auto;
  opacity: 0;
  border-radius: 4px;
  padding: 2px;
}

.tab-close:hover {
  background: rgba(255, 255, 255, 0.1);
}

.editor-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 40px;
}

.editor-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Status Bar */
.status-bar {
  height: 22px;
  background: #007acc;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  font-size: 11px;
}

.status-left, .status-right {
  display: flex;
  height: 100%;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
  cursor: pointer;
}

.status-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.status-item.remote {
  background: #16825d;
  margin-right: 4px;
}

/* Markdown Styling */
.markdown-body {
  line-height: 1.6;
  color: #cccccc;
}

.markdown-body :deep(h1) {
  border-bottom: 1px solid #3c3c3c;
  padding-bottom: 0.3em;
  margin-top: 1em;
  color: #fff;
}

.markdown-body :deep(h3) {
  margin-top: 1.5em;
  color: #007acc;
}

.markdown-body :deep(strong) {
  color: #fff;
}

.markdown-body :deep(ul) {
  padding-left: 20px;
}

.markdown-body :deep(li) {
  margin: 6px 0;
}




</style>
