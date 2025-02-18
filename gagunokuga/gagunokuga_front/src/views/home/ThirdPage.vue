<template>
  <section class="community-section">
    <div class="content-wrapper">
      <!-- 왼쪽 콘텐츠 (카드 모음) -->
      <div class="cards-content">
        <div class="card-grid">
          <div class="community-card">
            <img src="../../assets/gagunokugaLogo.png" alt="인테리어 예시" class="card-image">
            <div class="card-info">
              <span class="category">집들이</span>
              <h3>모던한 24평 아파트의 변신</h3>
            </div>
          </div>
          <div class="community-card">
            <img src="../../assets/gagunokugaLogo.png" alt="인테리어 예시" class="card-image">
            <div class="card-info">
              <span class="category">노하우</span>
              <h3>좁은 공간 활용하기</h3>
            </div>
          </div>
          <div class="community-card">
            <img src="../../assets/gagunokugaLogo.png" alt="인테리어 예시" class="card-image">
            <div class="card-info">
              <span class="category">시공후기</span>
              <h3>15년된 주택 리모델링</h3>
            </div>
          </div>
        </div>
      </div>

      <!-- 오른쪽 텍스트 영역 -->
      <div class="text-content" v-bind:class="{ 'fade-in': isVisible }">
        <h2 class="title">더 특별한 공간을<br>위한 이야기</h2>
        <p class="subtitle">
          다른 사람들의 인테리어 노하우를 둘러보고<br>
          나만의 특별한 공간 이야기를 공유해보세요
        </p>
        <button class="community-button" @click="goToCommunity">커뮤니티 둘러보기</button>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'CommunitySection',
  setup() {
    const router = useRouter()
    const isVisible = ref(false)

    onMounted(() => {
      const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          isVisible.value = true
        }
      })
      observer.observe(document.querySelector('.community-section'))
    })

    const goToCommunity = () => {
      router.push('/article')  // 메인 페이지의 커뮤니티 섹션으로 이동
    }

    return {
      isVisible,
      goToCommunity
    }
  }
}
</script>

<style lang="scss" scoped>
.community-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: #f8f9fc;
  padding: 4rem 2rem;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 4rem;
  align-items: center;
}

// .text-content {
//   flex: 1;
//   opacity: 0;
//   transform: translateY(20px);
//   transition: all 0.8s ease-out;

//   &.fade-in {
//     opacity: 1;
//     transform: translateY(0);
//   }
// }

.title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  line-height: 1.3;
  letter-spacing: -0.02em;
}

.subtitle {
  font-size: 1.3rem;
  line-height: 1.6;
  color: #666;
  margin-bottom: 2.5rem;
}

.community-button {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #2980b9;
    transform: translateY(-2px);
  }
}

.cards-content {
  flex: 1.2;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  position: relative;
}

.community-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  &:first-child {
    grid-column: 1 / -1;
  }
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-info {
  padding: 1.5rem;

  .category {
    font-size: 0.9rem;
    color: #3498db;
    font-weight: 600;
    margin-bottom: 0.5rem;
    display: block;
  }

  h3 {
    font-size: 1.2rem;
    color: #2c3e50;
    margin: 0;
    font-weight: 600;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column-reverse;
    text-align: center;
  }
  
  .card-grid {
    grid-template-columns: 1fr;
  }
}
</style>