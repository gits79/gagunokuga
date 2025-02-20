<template>
    <Transition name="fade">
      <div v-if="showTutorial" class="tutorial-overlay">
        <!-- Semi-transparent overlay -->
        <div class="overlay-background"></div>
        
        <!-- Tutorial content -->
        <div class="tutorial-content" :class="currentStep.position">
          <p class="tutorial-text">{{ currentStep.text }}</p>
          <div class="tutorial-buttons">
            <button v-if="stepIndex > 0" @click="prevStep" class="tutorial-button secondary">
              이전
            </button>
            <button @click="nextStep" class="tutorial-button primary">
              {{ isLastStep ? '시작하기' : '다음' }}
            </button>
          </div>
        </div>
  
        <!-- Highlight area -->
        <div 
          v-if="currentStep.highlight"
          class="highlight-area"
          :style="highlightStyle"
        ></div>
      </div>
    </Transition>
  </template>
  
  <script setup>
  import { ref, computed, onMounted  } from 'vue';
  
  const showTutorial = ref(false);
  const stepIndex = ref(0);
  
  const tutorialSteps = [
    {
      text: "여기서 도면을 그리거나 수정할 수 있어요",
      position: "center-left",
      highlight: {
        top: "190px",
        left: "12px",
        width: "40px",
        height: "190px"
      }
    },
    {
      text: "여기서 그리드와 길이를 껐다 킬 수 있어요",
      position: "bottom-left",
      highlight: {
        bottom: "8px",
        left: "12px",
        width: "40px",
        height: "140px"
      }
    },
    {
      text: "그럼 시작해 볼까요?",
      position: "center",
      highlight: null
    }
  ];
  
  const currentStep = computed(() => tutorialSteps[stepIndex.value]);
  const isLastStep = computed(() => stepIndex.value === tutorialSteps.length - 1);
  
  const highlightStyle = computed(() => {
    if (!currentStep.value.highlight) return {};
    return currentStep.value.highlight;
  });

  onMounted(() => {
  const hasSeenTutorial = localStorage.getItem('hasSeenFloorEditorTutorial');
  if (!hasSeenTutorial) {
    showTutorial.value = true;
  }
});
  
  const nextStep = () => {
    if (isLastStep.value) {
      showTutorial.value = false;

      localStorage.setItem('hasSeenFloorEditorTutorial', 'true');
      return;
    }
    stepIndex.value++;
  };
  
  const prevStep = () => {
    if (stepIndex.value > 0) {
      stepIndex.value--;
    }
  };
  </script>
  
  <style scoped>
  .tutorial-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    font-family: '42dot Sans', serif;
  }
  
  .overlay-background {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
  }
  
  .tutorial-content {
    position: absolute;
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 350px;
  }
  
  .tutorial-content.center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  .tutorial-content.center-left {
    top: 50%;
    left: 100px;
    transform: translateY(-50%);
  }
  
  .tutorial-content.bottom-left {
    bottom: 100px;
    left: 100px;
  }
  
  .tutorial-text {
    font-size: 16px;
    color: #333;
    margin-bottom: 1.5rem;
  }
  
  .tutorial-buttons {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
  }
  
  .tutorial-button {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    border: none;
  }
  
  .tutorial-button.primary {
    background: #4f46e5;
    color: white;
  }
  
  .tutorial-button.primary:hover {
    background: #4338ca;
  }
  
  .tutorial-button.secondary {
    background: #f3f4f6;
    color: #374151;
  }
  
  .tutorial-button.secondary:hover {
    background: #e5e7eb;
  }
  
  .highlight-area {
    position: absolute;
    border: 2px solid #4f46e5;
    border-radius: 4px;
    animation: pulse 2s infinite;
    pointer-events: none;
  }
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.4);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(79, 70, 229, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(79, 70, 229, 0);
    }
  }
  
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>