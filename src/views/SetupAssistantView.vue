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
    emit('complete')
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
        <div class="image-container" v-if="steps[currentStepIndex].image">
          <img :src="steps[currentStepIndex].image" :alt="steps[currentStepIndex].title" class="step-image" />
        </div>
        <h1 class="step-title">{{ steps[currentStepIndex].title }}</h1>
        <p class="step-subtitle" v-if="steps[currentStepIndex].subtitle">{{ steps[currentStepIndex].subtitle }}</p>
      </div>

      <div class="step-body" v-html="steps[currentStepIndex].content"></div>
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
  padding: 40px;
  text-align: center;
  overflow-y: auto;
}

.image-container {
  margin-bottom: 24px;
}

.step-image {
  width: 120px;
  height: 120px;
  object-fit: contain;
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

.setup-btn {
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.setup-btn.primary {
  background: #007aff;
  color: #fff;
}

.setup-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

@media (hover: hover) {
  .setup-btn.primary:hover {
    background: #0063cc;
  }
  .setup-btn.secondary:hover {
    background: rgba(255, 255, 255, 0.15);
  }
}

.setup-btn:active {
  transform: scale(0.98);
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
