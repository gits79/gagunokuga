<template>
  <section class="furniture-section">
    <div class="content-wrapper">
      <!-- 왼쪽 텍스트 영역 -->
      <div class="text-content" 
           v-bind:class="{ 'fade-in': isVisible }">
        <h2 class="title">나만의 공간을<br>한 번에 완성하세요</h2>
        <p class="subtitle">
          도면 제작부터 가구 배치까지,<br>
          클릭 한 번으로 쉽게 시작해보세요.
        </p>
        <button class="start-button" @click="goToEditor">시작하기</button>
      </div>

      <!-- 오른쪽 인터랙티브 데모 영역 -->
      <div class="demo-content">
        <div class="room-layout">
          <!-- 도면 배경 -->
          <div class="blueprint-bg"></div>
          <!-- 드래그 가능한 가구 아이템들 -->
          <div v-for="(furniture, index) in furnitureItems"
               :key="index"
               class="furniture-item"
               :style="furniture.style"
               draggable="true"
               @dragstart="dragStart"
               @dragend="dragEnd">
            <img :src="furniture.icon" :alt="furniture.name">
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'FurnitureSection',
  setup() {
    const router = useRouter()
    const isVisible = ref(false)
    const furnitureItems = ref([
      {
        name: '소파',
        icon: '/icons/sofa.svg',
        style: {
          top: '50%',
          left: '30%'
        }
      },
      {
        name: '테이블',
        icon: '/icons/table.svg',
        style: {
          top: '40%',
          left: '50%'
        }
      }
    ])

    onMounted(() => {
      const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          isVisible.value = true
        }
      })
      observer.observe(document.querySelector('.furniture-section'))
    })

    const goToEditor = () => {
      router.push('/room')
    }

    const dragStart = (e) => {
      e.target.classList.add('dragging')
    }

    const dragEnd = (e) => {
      e.target.classList.remove('dragging')
      const rect = e.target.getBoundingClientRect()
      e.target.style.left = `${rect.left}px`
      e.target.style.top = `${rect.top}px`
    }

    return {
      isVisible,
      furnitureItems,
      goToEditor,
      dragStart,
      dragEnd
    }
  }
}
</script>

<style lang="scss" scoped>
.furniture-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
  padding: 4rem 2rem;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 4rem;
  align-items: center;
}

.text-content {
  flex: 1;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease-out;

  &.fade-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.subtitle {
  font-size: 1.4rem;
  line-height: 1.6;
  color: #5a6c7f;
  margin-bottom: 2.5rem;
  font-weight: 400;
  word-break: keep-all;
}

.start-button {
  padding: 1.2rem 3rem;
  font-size: 1.2rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;

  &:hover {
    background: #2980b9;
    transform: translateY(-2px);
  }
}

.demo-content {
  flex: 1.2;
  position: relative;
}

.room-layout {
  aspect-ratio: 4/3;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;
}

.blueprint-bg {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(#e5e5f7 1.5px, transparent 1.5px),
                    linear-gradient(90deg, #e5e5f7 1.5px, transparent 1.5px);
  background-size: 20px 20px;
  opacity: 0.3;
}

.furniture-item {
  position: absolute;
  cursor: move;
  padding: 0.5rem;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  &.dragging {
    opacity: 0.8;
    z-index: 100;
  }

  img {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
    text-align: center;
  }
  
  .demo-content {
    width: 100%;
  }
}
</style>