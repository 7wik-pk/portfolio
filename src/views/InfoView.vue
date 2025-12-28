<script setup>
defineProps({
  image: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ""
  },
  details: {
    type: Array, // Array of { label: string, value: string }
    default: () => []
  },
  buttons: {
    type: Array, // Array of { text: string, action: string, type: 'primary' | 'secondary' }
    default: () => []
  }
})

const emit = defineEmits(['button-click'])
</script>

<template>
  <div class="info-view">
    <div class="info-container">
      <div class="info-left">
        <img :src="image" :alt="title" class="main-image" />
      </div>
      
      <div class="info-right">
        <h1 class="main-title">{{ title }}</h1>
        <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
        
        <div class="details-list">
          <div v-for="(item, index) in details" :key="index" class="detail-row">
            <span class="detail-label">{{ item.label }}</span>
            <span class="detail-value">{{ item.value }}</span>
          </div>
        </div>

        <div class="buttons-container">
          <button 
            v-for="(btn, index) in buttons" 
            :key="index" 
            class="info-btn" 
            :class="btn.type || 'secondary'"
            @click="emit('button-click', btn.action)"
          >
            {{ btn.text }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.info-view {
  height: 100%;
  width: 100%;
  display: flex;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  color: #fff;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  padding: 24px;
  overflow-y: auto;
}

.info-container {
  display: flex;
  align-items: center;
  gap: 40px;
  max-width: 600px;
  margin: auto; /* This centers horizontally/vertically without clipping top content on overflow */
}

.info-left {
  flex-shrink: 0;
  padding-left: 20px;
  padding-bottom: 20px;
}

.main-image {
  width: 170px;
  height: 170px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
}

.info-right {
  display: flex;
  flex-direction: column;
}

.main-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.02em;
}

.subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin: 4px 0 24px 0;
}

.details-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 30px;
}

.detail-row {
  display: flex;
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 4px;
}

.detail-label {
  flex: 0 0 90px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  padding-right: 12px;
  text-align: right;
}

.detail-value {
  flex: 1;
  color: rgba(255, 255, 255, 0.65);
  word-break: break-word;
}

.buttons-container {
  display: flex;
  gap: 12px;
  align-items: center;
}

.info-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 0.5px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 6px 20px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.info-btn.primary {
  background: #007aff;
  border-color: #007aff;
}

@media (hover: hover) {
  .info-btn:hover {
    background: rgba(255, 255, 255, 0.15);
  }
  .info-btn.primary:hover {
    background: #0063cc;
  }
}

.info-btn:active {
  background: rgba(255, 255, 255, 0.05);
}

@media (max-width: 600px) {
  .info-view {
    align-items: flex-start; /* Ensure scrolling starts from top */
    padding: 32px 20px;
  }

  .info-container {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 20px;
    margin: 0 auto;
  }
  
  .info-left {
    padding: 0; /* Clear the asymmetrical desktop padding */
  }

  .info-right {
    align-items: center;
  }
  
  .info-btn {
    align-self: center;
  }
  
  .detail-row {
    flex-direction: column;
    gap: 2px;
  }
  
  .detail-label {
    flex: none;
    width: auto;
    text-align: center;
    padding-right: 0;
  }

  .detail-value {
    text-align: center;
  }
}
</style>
