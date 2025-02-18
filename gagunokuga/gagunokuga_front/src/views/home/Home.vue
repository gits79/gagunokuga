<template>
  <div id="fullpage">
    <!-- 1번째 페이지 -->
    <section v-for="(section, index) in sections" :key="index" class="section page beige" :class="{ 'center-text': index === 0}">
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
import { ref, onMounted, Transition, computed} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useLoginStore } from '../login/login';

const router = useRouter();
const route = useRoute();
const loginStore = useLoginStore();
// 현재 로그인한 사용자 정보
const currentUser = computed(() => loginStore.state.nickname);

const handleButtonClick = () => {
  if(currentUser.value){
    router.push('/room');
  } else {
    router.push('/login');
  }
};

const sections = ref([
  {
    contents: [
      {type: 'h1', text: '모두의 생각이 모여 완성되는 우리집, <br> 가구놓구가'},
      {type: 'p', text: '공간을 넘어 마음을 모아<br>사랑하는 이들과 함께 실시간으로 <br>아이디어를 나누고 가구 배치를 완성해보세요.'},
      {type: 'button', text: '시작하기', action: handleButtonClick }
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
  if (route.path === "/") { // 메인 페이지 경로일 때만 초기화
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
@import "./home.css";
</style>