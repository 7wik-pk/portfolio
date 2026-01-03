<script setup>
import { ref } from 'vue'

const props = defineProps({
  steps: {
    type: Array,
    required: true,
    // Each step: { title: '', subtitle: '', image: '', content: '', buttonText: '' }
  }
})

const currentStepIndex = ref(0)
const emit = defineEmits(['close', 'complete'])

const nextStep = () => {
  if (currentStepIndex.value < props.steps.length - 1) {
    currentStepIndex.value++
  } else {
    emit('close')
  }
}

const prevStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
  }
}
</script>

<template>
  <div class="setup-assistant">
    <div class="setup-content">
      <div class="setup-header">
        <div 
          class="image-container" 
          :class="{ 'is-slide': steps[currentStepIndex].layout === 'slide' }"
          v-if="steps[currentStepIndex].image"
        >
          <img :src="steps[currentStepIndex].image" :alt="steps[currentStepIndex].title" class="step-image" />
        </div>
        <h1 class="step-title">{{ steps[currentStepIndex].title }}</h1>
        <p class="step-subtitle" v-if="steps[currentStepIndex].subtitle">{{ steps[currentStepIndex].subtitle }}</p>
      </div>

      <div class="step-body" v-if="steps[currentStepIndex].description">
        {{ steps[currentStepIndex].description }}
      </div>
      <div class="step-content-html" v-if="steps[currentStepIndex].content" v-html="steps[currentStepIndex].content"></div>

      <!-- Slide Layout Support (Big Image) -->
      <div v-if="steps[currentStepIndex].layout === 'slide'" class="slide-layout">
         <!-- Image already shown in header via steps[currentStepIndex].image -->
      </div>
      
      <!-- Grid Layout Support -->
    </div>

    <div class="setup-footer">
      <button class="setup-btn secondary" @click="prevStep" v-if="currentStepIndex > 0">Back</button>
      <div class="spacer"></div>
      <button class="setup-btn primary" @click="nextStep">
        {{ currentStepIndex === steps.length - 1 ? 'Done' : (steps[currentStepIndex].buttonText || 'Continue') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.setup-assistant {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(30, 30, 30, 0.75);
  backdrop-filter: blur(30px) saturate(180%);
  color: #fff;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
}

.setup-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
  overflow-y: auto;
}

.image-container {
  margin-bottom: 16px;
}

.step-image {
  width: 140px;
  height: 140px;
  object-fit: contain;
  /* For slide layout, make images much bigger and cover */
}

.step-title {
  font-size: 34px;
  font-weight: 700;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}

.step-subtitle {
  font-size: 17px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 32px;
}

.step-body {
  max-width: 500px;
  font-size: 15px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);
}


.grid-image-container {
  width: 100%;
  aspect-ratio: 16/10;
  overflow: hidden;
  border-radius: 8px;
}

.grid-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}


/* Adjustments for Slide Layout */
.slide-layout {
  display: none; /* Content is handled by header logic, but we can add specific styles if needed */
}

/* If the current step is a "slide", we want the image to be larger */
.image-container.is-slide .step-image {
  width: 100%;
  max-width: 500px;
  height: 280px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
}

.step-body, .step-content-html {
  max-width: 600px;
  font-size: 16px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.95);
  margin-top: 10px;
}

.setup-footer {
  height: 80px;
  padding: 0 40px;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border-top: 0.5px solid rgba(255, 255, 255, 0.1);
}

.spacer {
  flex: 1;
}



/* Consistent macOS-like Button Styles */
.setup-btn {
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

@media (hover: hover) {
  .setup-btn:hover {
    background: rgba(255, 255, 255, 0.15);
  }
}

.setup-btn:active {
  background: rgba(255, 255, 255, 0.05);
}

@media (max-width: 600px) {
  .setup-content {
    padding: 24px;
  }
  .step-title {
    font-size: 28px;
  }
  .setup-footer {
    padding: 0 24px;
  }
}
</style>
