<template>
  <div id="fullpage">
    <!-- 1번째 페이지 -->
    <section class="section page blue">
      <div class="content" v-bind:class="{ 'fade-in': showFirst }">
        <h1 class="title">
          모두의 생각이 모여<br/>
          완성되는 우리집
        </h1>
      </div>
      <div class="content" v-bind:class="{ 'fade-in': showSecond }">
        <p  class="subtitle">
          공간을 넘어 마음을 모아 사랑하는 이들과 함께<br/>실시간으로 아이디어를 나누고 가구 배치를 완성해보세요
        </p>
      </div>
      <div class="content" v-bind:class="{ 'fade-in': showThird }">
        <button class="download-btn">에디터 바로가기</button>
      </div>
    </section>

    <!-- 2번째 페이지 -->
    <section class="section page blue second-section">
      <div class="content" v-bind:class="{ 'fade-in': showFourth }">
        <h2 class="title">
          간편하고 정확한 도면설계부터 가구배치
        </h2>
      </div>
      <div class="content" v-bind:class="{ 'fade-in': showFifth }">
        <p class="subtitle">
          제공되는 기본 레이아웃으로 쉽게 시작하고, <br/>
          직관적인 도구로 정확하게 공간을 설계하세요. <br/>
          간단한 드래그로 가구를 배치하고 조정할 수 있습니다.
        </p>
      </div>
      <div class="content" v-bind:class="{ 'fade-in': showSixth }">
        <button class="download-btn" @click="goToEditor">시작하기</button>
      </div>
      <div>
        <Transition name="bounce" v-show="showImage">
          <img src="/gagunokuga_logo_mark.svg" alt="가구놓구가 로고" class="main-image" />
        </Transition>
      </div>
    </section>

    <!-- 3번째 페이지 -->
    <section class="section page blue">
      <span class="title">
        떨어져 있어도 함께 만드는 우리 집
        -- 실시간 동시 편집으로 함께 가구를 배치하고
    -- 채팅으로 즉각적인 피드백을 주고받으세요
        </span>
    </section>

    <!-- 4번째 페이지 -->
     <section class="section page blue fourth-section">
      <div class="community-section">
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
          <h2 class="title">공간의 영감을 나누는 커뮤니티</h2>
          <p class="subtitle">
            나만의 특별한 공간을 공유하고 <br/>
            다양한 아이디어로 영감을 채워보세요
          </p>
          <button class="community-button" @click="goToCommunity">커뮤니티 둘러보기</button>
        </div>
      </div>
    </div>
    </section>
  </div>
</template>
  
<script setup>
import { ref, onMounted, Transition} from 'vue';
import { useRouter } from 'vue-router';
import fullpage from 'fullpage.js';

const showFirst = ref(false);
const showSecond = ref(false);
const showThird = ref(false);
const showFourth = ref(false);
const showFifth = ref(false);
const showSixth = ref(false);

const showImage = ref(false);

const router = useRouter();

onMounted(() => {
  new fullpage('#fullpage', {
    autoScrolling: true,
    navigation: true,
    scrollHorizontally: true,
    scrollBar: false,
    scrollingSpeed: 1500,
  });

  setTimeout(() => {
    showFirst.value = true;
    setTimeout(() => {
      showSecond.value = true;
      setTimeout(() => {
        showThird.value = true;
      }, 500);
    }, 500);
  }, 500);

  // 2번째 페이지 진입 시
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      showImage.value = true;
      setTimeout(() => {
        showFourth.value = true;
        setTimeout(() => {
          showFifth.value = true;
          setTimeout(() => {
            showSixth.value = true;
          }, 500);
        }, 500);
      }, 500);
    }
  });
  observer.observe(document.querySelector('.second-section'));
});

const goToEditor = () => {
  router.push('/room');
};

</script>

  
  <style lang="scss" scoped>
  @import 'https://cdnjs.cloudflare.com/ajax/libs/fullPage.js/4.0.20/fullpage.min.css';
  
  /* 크롬, 사파리에서 스크롤바 숨기기 */
::-webkit-scrollbar {
  display: none;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
}

/* 기본 섹션 스타일 */
.page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  // text-align: center;
}

.content {
  max-width: 800px;
  color: black;
  align-items: left;
  opacity: 0;
  /* text-align: left; */
  /* margin-left: 10%; */
  // transform: translateY(20px);
  
  &.fade-in {
    opacity: 1;
    transform: translateX(0);
    transition: all 3.0s ease-out;
    }
}

.blue { 
  /* background-color: linear-gradient(135deg, #f6f8ff 0%, #e9ecf9 100%);   */
  background-color:#f6f8ff; color: white;
}

.pink { 
  /* background-color: linear-gradient(135deg, #f6f8ff 0%, #e9ecf9 100%);   */
  background-color:#FFF6F2; color: white;
}

/* 텍스트 스타일 */
.title {
  font-size: 2rem;
  font-weight: bold;
  color: black;
  line-height: 1.6;
  margin-bottom: 20px;
}

.subtitle {
    font-size: 1.2rem;
    line-height: 1.5;
    color: #5a6c7f;
    margin-top: 10px;
    margin-bottom: 2rem;
  }

/* 버튼 스타일 */
.download-btn {
  background-color:rgb(30, 59, 138);
  color: white;
  padding: 12px 24px;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  margin-top: 20px;
  border: none;
}

.download-btn:hover {
  background-color:rgb(16, 39, 92);
}

.icon {
  width: 45px;
  height: 45px;
  margin-right: 10px;
  margin-top: 5px;
}

/* 이미지 스타일 */
.main-image {
  position: absolute;
  right: 5%;
  bottom: 0;
  width: 500px;
  height: auto;
}

.bounce-enter-active {
  animation: bounce-in 3.0s;
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

.section div {
    transition: all .3s .5s;
}

@keyframes bounce-in {
  0% { transform: scale(0); }
  50% { transform: scale(1.25); }
  100% { transform: scale(1); }
}

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