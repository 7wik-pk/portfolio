<script setup>
import { ref } from 'vue'

const props = defineProps({
  sections: {
    type: Array,
    required: true,
    // [ { id: '', label: '', icon: '', items: [ { label: '', value: '', type: 'text|toggle|link' } ] } ]
  },
  title: {
    type: String,
    default: 'System Settings'
  },
  initialSectionId: {
    type: String,
    default: null
  }
})

const getInitialSection = () => {
  if (props.initialSectionId) {
    const found = props.sections.find(s => s.id === props.initialSectionId)
    if (found) return found
  }
  return props.sections[0]
}

const activeSection = ref(getInitialSection())
const activeSectionId = ref(activeSection.value?.id)

const selectSection = (section) => {
  activeSectionId.value = section.id
  activeSection.value = section
}
</script>

<template>
  <div class="settings-view">
    <!-- Sidebar -->
    <div class="settings-sidebar">
      <div class="sidebar-header">
        <h2 class="sidebar-title">{{ title }}</h2>
      </div>
      
      <div class="sidebar-items">
        <div 
          v-for="section in sections" 
          :key="section.id"
          class="sidebar-item"
          :class="{ active: activeSectionId === section.id }"
          @click="selectSection(section)"
        >
          <div 
            class="section-icon" 
            :style="{ background: (section.icon && (section.icon.includes('/') || section.icon.includes('.'))) ? 'transparent' : (section.iconColor || '#007aff') }"
          >
            <img v-if="section.icon && (section.icon.includes('/') || section.icon.includes('.'))" :src="section.icon" class="sidebar-img-icon" />
            <span v-else-if="section.icon">{{ section.icon }}</span>
          </div>
          <span class="section-label">{{ section.label }}</span>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="settings-main" v-if="activeSection">
      <div class="main-header" :class="{ 'has-images': activeSection.headerImage || activeSection.idImage }">
        <div class="header-images" v-if="activeSection.headerImage || activeSection.idImage">
            <div class="header-img-container" v-if="activeSection.headerImage">
                <img :src="activeSection.headerImage" class="header-img logo-img" alt="Institution Logo" />
            </div>
            <div class="header-img-container id-container" v-if="activeSection.idImage">
                <img :src="activeSection.idImage" class="header-img id-img" alt="ID Card" />
            </div>
        </div>
        <h1 class="section-heading">{{ activeSection.label }}</h1>
      </div>

      <div class="settings-group" v-for="(group, gIdx) in activeSection.groups" :key="gIdx">
        <h3 class="group-title" v-if="group.title">{{ group.title }}</h3>
        <div class="group-card">
          <div 
            v-for="(item, iIdx) in group.items" 
            :key="iIdx"
            class="settings-row"
            :class="{ 'align-start': item.type === 'multiline' || item.type === 'tags' }"
          >
            <div class="row-left">
              <span class="item-label">{{ item.label }}</span>
            </div>
            <div class="row-right">
              <span class="item-value" v-if="item.type === 'text'">{{ item.value }}</span>
              <div class="item-tags" v-if="item.type === 'tags'">
                <span v-for="tag in item.value" :key="tag" class="settings-tag">{{ tag }}</span>
              </div>
              <div class="item-multiline" v-if="item.type === 'multiline'">
                {{ item.value }}
              </div>
              <div class="item-toggle" v-if="item.type === 'toggle'">
                <div class="toggle-bg" :class="{ on: item.value }">
                  <div class="toggle-handle"></div>
                </div>
              </div>
              <span class="item-arrow" v-if="item.type === 'link'">›</span>
            </div>
          </div>
        </div>
        <p class="group-footer" v-if="group.footer">{{ group.footer }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-view {
  display: flex;
  height: 100%;
  background: rgba(30, 30, 30, 0.75);
  backdrop-filter: blur(30px) saturate(180%);
  color: #fff;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
}

.settings-sidebar {
  width: 200px;
  background: rgba(255, 255, 255, 0.05);
  border-right: 0.5px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 24px 16px 12px;
}

.sidebar-title {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
}

.sidebar-items {
  padding: 0 8px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 2px;
}

.sidebar-item.active {
  background: rgba(255, 255, 255, 0.1);
}

.section-icon {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.section-label {
  font-size: 13px;
  font-weight: 500;
}

.sidebar-img-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 4px;
}

.settings-main {
  flex: 1;
  padding: 32px 40px;
  overflow-y: auto;
}

.section-heading {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
}

.main-header.has-images {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 30px;
}

.header-images {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.header-img-container {
    position: relative;
    /* transition removed */
}

/* Hover removed */

.header-img {
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.3);
    object-fit: cover;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-img {
    height: 120px;
    width: auto;
    max-width: 220px;
}

.id-img {
    height: 135px;
    width: auto;
    transform: rotate(3deg);
    border: 2px solid rgba(255, 255, 255, 0.2);
}

.id-container {
    transform: rotate(-3deg);
}

.settings-group {
  margin-bottom: 24px;
}

@media (max-width: 600px) {
  .logo-img {
    height: 80px;
    max-width: 100%;
  }
  .id-img {
    height: 100px;
  }
}

.group-title {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 8px;
  padding-left: 2px;
}

.group-card {
  background: rgba(255, 255, 255, 0.05);
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.settings-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.05);
}

.settings-row:last-child {
  border-bottom: none;
}

.settings-row.align-start {
  align-items: flex-start;
  padding-top: 12px;
  padding-bottom: 12px;
}

.item-label {
  font-size: 13px;
  font-weight: 500;
}

.item-value {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
}

.item-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: flex-end;
  max-width: 300px;
}

.settings-tag {
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
}

.item-multiline {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  text-align: right;
  max-width: 300px;
  line-height: 1.4;
}

.group-footer {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  margin-top: 8px;
  padding: 0 4px;
  line-height: 1.4;
}

.item-arrow {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.2);
}

/* Toggle Switch */
.item-toggle {
  cursor: pointer;
}

.toggle-bg {
  width: 36px;
  height: 20px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  position: relative;
  transition: background 0.2s ease;
}

.toggle-bg.on {
  background: #34c759;
}

.toggle-handle {
  width: 16px;
  height: 16px;
  background: #fff;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.2s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}

.toggle-bg.on .toggle-handle {
  transform: translateX(16px);
}

@media (max-width: 768px) {
  .settings-sidebar {
    width: 60px;
  }
  .section-label, .sidebar-title {
    display: none;
  }
  .settings-main {
    padding: 24px;
  }
}
</style>
