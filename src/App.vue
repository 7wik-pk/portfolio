<template>
  <div class="macos-container">
    <MenuBar />
    <div class="desktop">
      <AppDrawer v-if="drawerOpen" @close="closeDrawer" />
    </div>
    <Dock @open-drawer="openDrawer" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MenuBar from './components/MenuBar.vue'
import Dock from './components/Dock.vue'
import AppDrawer from './components/AppDrawer.vue'

const drawerOpen = ref(false)

const openDrawer = () => {
  drawerOpen.value = !drawerOpen.value
}

const closeDrawer = () => {
  drawerOpen.value = false
}
</script>

