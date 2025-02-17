<template>
  <div id="fullpage">
    <!-- 1번째 페이지 -->
    <section v-for="(section, index) in sections" :key="index" class="section page blue">
      <Transition name="bounce">
        <img v-if="section.contents[2] && section.contents[2].type === 'img' && visibleSections[index][0]"
        :src="section.contents[2].src" alt="가구놓구가 로고" class="main-image"/>
      </Transition>
      <div v-for="(content, i) in section.contents" :key="i"
      class="content" v-bind:class="{ 'fade-in': visibleSections[index][i], 'right-position': index === 2}">
        <component :is="content.type" class="title" v-if="content.type === 'h1' || content.type === 'h2'" v-html="content.text">
        </component>
        <p class="subtitle" v-else-if="content.type === 'p'" v-html="content.text"></p>
        <button class="download-btn" v-else-if="content.type === 'button'" @click="content.action">
          {{ content.text }}
        </button>
      </div>
    </section>
  </div>
</template>
  
<script setup>
import { ref, onMounted, Transition, watchEffect} from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const sections = ref([
  {
    contents: [
      {type: 'h1', text: '모두의 생각이 모여 <br> 완성되는 우리집'},
      {type: 'p', text: '공간을 넘어 마음을 모아<br>사랑하는 이들과 함께 실시간으로 <br>아이디어를 나누고 가구 배치를 완성해보세요.'},
      {type: 'button', text: '시작하기', action: () => router.push('/room')}
    ]
  },
  {
    contents : [
      {type: 'h2', text: '간편하고 정확한 <br> 도면설계부터 가구배치'},
      {type: 'p', text: '제공되는 기본 레이아웃으로 쉽게 시작하고,<br>직관적인 도구로 정확하게 공간을 설계하세요.<br>간단한 드래그로 가구를 배치하고 조정할 수 있습니다.'},
      {type: 'img', src: "/main.gif"}
    ],
  },
  {
    contents: [
      {type: 'h2', text: '떨어져 있어도 <br> 함께 만드는 우리 집'},
      {type: 'p', text: '실시간 동시 편집으로 함께 가구를 배치하고,<br>채팅으로 즉각적인 피드백을 주고받으세요.'}
    ]
  },
  {
    contents: [
      {type: 'h2', text: '공간의 영감을 나누는<br>커뮤니티'},
      {type: 'p', text: '나만의 특별한 공간을 공유하고<br>다양한 아이디어로 영감을 채워보세요.'},
    ]
  }
]);

const visibleSections = ref(sections.value.map(section => Array(section.contents.length).fill(false)));

onMounted(() => {
  if (route.path === "/test") { // 특정 페이지 경로일 때만 초기화
    initializeFullPage();
  }
});

function initializeFullPage() {
  if (window.$ && window.$.fn.fullpage) {
    window.$(document).ready(function() {
      window.$('#fullpage').fullpage({
        autoScrolling: true,
        navigation: true,
        scrollBar: false,
        scrollingSpeed: 1500,

        afterLoad: function (anchorLink, index) {
          const sectionIndex = index - 1; // fullPage.js의 index는 1부터 시작하므로 보정
          if (!visibleSections.value[sectionIndex].some(v => v)) { // 한 번만 실행되도록 체크
            setTimeout(() => {
              visibleSections.value[sectionIndex][0] = true;
              if (visibleSections.value[sectionIndex][3] !== undefined) {
                visibleSections.value[sectionIndex][3] = true;
              }
              setTimeout(() => {
                visibleSections.value[sectionIndex][1] = true;
                setTimeout(() => {
                  visibleSections.value[sectionIndex][2] = true;
                }, 500);
              }, 500);
            }, 500);
          }
        }
      });
    });
  }
}

router.beforeEach((to, from, next) => {
  // 페이지 이동 시 fullPage.js를 destroy하고 다시 초기화
  if (from.name) {
    window.$('#fullpage').fullpage.destroy('all'); // 현재 fullPage.js 인스턴스 해제
  }
  next();
});


</script>
  
<style lang="scss" scoped>
/* 크롬, 사파리에서 스크롤바 숨기기 */
::-webkit-scrollbar {
  display: none;
}

body {
  margin: 0;
  font-family: 'Arial', sans-serif;
  background-color: #f6f8ff;
}

/* 기본 섹션 스타일 */
.page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 0 10%;
  text-align: left;
}

/* 첫 번째 섹션에 배경 이미지와 연한 효과 */
.page:nth-child(1) {
  background: linear-gradient(
    rgba(255, 255, 255, 0.6), /* 배경색의 투명도 */
    rgba(255, 255, 255, 0.6)
  ), url('/main.png');  /* 배경 이미지 */
  background-size: cover;  /* 이미지 크기를 섹션 크기에 맞게 조정 */
  background-position: center;  /* 이미지가 섹션의 중앙에 위치하도록 */
  background-repeat: no-repeat;  /* 이미지 반복 방지 */
  height: 100vh;  /* 전체 섹션을 화면 크기만큼 설정 */
  position: relative;  /* 자식 요소의 위치를 조정하기 위한 설정 */
}

.content {
  max-width: 600px;
  // color: #2c3e50;
  color:black;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease-out;
  padding: 0 30px;
  position: relative;
}

.content.fade-in {
  opacity: 1;
  transform: translateY(0);
}

.right-position {
  left: 60%;
  padding: 0 30px;
}

/* 섹션 스타일 */
.blue {
  background-color: #f6f8ff;
  color: #2c3e50;
}

.pink {
  background-color: #fff6f2;
  color: #2c3e50;
}

/* 타이틀 스타일 */
.title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 30px;
  color: black;
  // color: #2c3e50;
  line-height: 1.6;
  padding-top: 30%;
}

.subtitle {
  font-size: 1.3rem;
  line-height: 1.6;
  color: #444;
  margin-bottom: 30px;
}

/* 버튼 스타일 */
.download-btn {
  background-color:#EF5C4E;
  // background-color: #1e3b8a;
  color: white;
  padding: 15px 20px;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: none;
  margin-top: 1%;
}

.download-btn:hover {
  background-color:rgb(239, 69, 54);
  // background-color: #10375c;
}

/* 이미지 스타일 */
.main-image {
  position: absolute;
  right: 10%;
  top: 20%;
  width: 40%;
  height: auto;
  border-radius: 10%;
  animation: bounce-in 1.5s ease-out;
}

.bounce-enter-active {
  animation: bounce-in 1.5s ease-out;
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% { transform: scale(0); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* 미디어 쿼리 - 작은 화면에서의 스타일 */
@media (max-width: 768px) {
  .title {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.1rem;
  }
}
 
</style>