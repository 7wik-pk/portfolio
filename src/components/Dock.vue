<template>
  <div class="dock-container">
    <div class="dock">
      <div 
        v-for="(app, index) in dockApps" 
        :key="index"
        class="dock-item"
        :class="{ 'dock-item-separator': app.separator }"
        @click="app.action && app.action()"
      >
        <div v-if="!app.separator" class="dock-icon-wrapper">
          <div class="dock-label">{{ app.name }}</div>
          <div class="dock-icon">
            <img v-if="app.image" :src="app.image" :alt="app.name" class="dock-image-icon" />
            <span v-else>{{ app.emoji }}</span>
          </div>
          <div class="dock-indicator"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import finderIcon from '../assets/icons/finder-2021-09-10.webp'
import launchpadIcon from '../assets/icons/launchpad.webp'
import githubIcon from '../assets/icons/github2.png'
import linkedinIcon from '../assets/icons/linkedin-app-icon.webp'
import eduIcon from '../assets/icons/edu.png'
import photosIcon from '../assets/icons/photos-2021-05-28.png'
import hobbiesIcon from '../assets/icons/garageband-2020-12-10.webp'
import vsCodeIcon from '../assets/icons/vscode.png'
import steamIcon from '../assets/icons/steam.webp'

const emit = defineEmits(['open-drawer'])

const dockApps = [
  
// finder - should take them to a macOS finder view to show my resume and projects as links 
  { name: 'Finder', image: finderIcon, emoji: '📁', action: null },

  // app drawer - should show icons to my github, linkedin, email, and my github projects. also have a YT icon linking to you-know-what.
  { name: 'Launchpad', image: launchpadIcon, emoji: '📱', action: () => emit('open-drawer') },

  // tech stack - skills, languages, frameworks, etc. that I know
  { name: 'Tech Stack Familiarity', image: vsCodeIcon, emoji: '📺', action: null },

  // github
  { name: 'GitHub', image: githubIcon, emoji: '🐙', action: () => window.open('https://github.com/7wik-pk', '_blank') },

  // linkedin
  { name: 'LinkedIn', image: linkedinIcon, emoji: '🔗', action: () => window.open('https://www.linkedin.com/in/sathwik-k-77b58b140/', '_blank') },
  
  // educational background
  { name: 'Education', image: eduIcon, emoji: '🎓', action: null },

  // should show my images (?)
  // { name: 'Photos', image: photosIcon, emoji: '📷', action: null },

  // hobbies - list out and figure out a clever way to display my hobbies. also decide on a suitable icon.
  { name: 'Hobbies', image: hobbiesIcon, emoji: '🎵', action: null },



  // // about - show a little bit about me
  // { emoji: '📚', action: null },

  // steam - show a little bit about me
  { name: 'Steam', image: steamIcon, emoji: '🎮', action: () => window.open('https://steamcommunity.com/id/7wik_pk', '_blank') },

  // { separator: true },
  // { emoji: '🗑️', action: null },
]

</script>

<style scoped>
.dock-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding-bottom: 4px;
  z-index: 999;
  pointer-events: none;
}

.dock {
  display: flex;
  align-items: flex-end;
  /* height: 64px; */
  padding: 0 4px;
  background: rgba(30, 30, 30, 0.4);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border-radius: 18px;
  border: 0.5px solid rgba(255, 255, 255, 0.15);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  pointer-events: auto;
  /* gap: 4px; */
}

.dock-item {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  /* padding: 4px; */
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.dock-label {
  position: absolute;
  top: -45px;
  background: rgba(30, 30, 30, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  color: #fff;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 400;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
  transform: translateY(10px);
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
}

.dock-item:hover .dock-label {
  opacity: 1;
  transform: translateY(0);
}

.dock-item-separator {
  width: 1px;
  height: 48px;
  background: rgba(255, 255, 255, 0.15);
  margin: 0 4px;
  pointer-events: none;
}

.dock-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dock-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  /* padding-bottom: 4px; */
  /* padding: 4px; */
  margin: 6px;
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  overflow: hidden;
}

.dock-image-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.dock-indicator {
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.dock-item:hover .dock-icon {
  transform: scale(1.3) translateY(-8px);
}

.dock-item:hover .dock-indicator {
  opacity: 1;
}

.dock-item:active .dock-icon {
  transform: scale(1.2) translateY(-6px);
}
</style>

