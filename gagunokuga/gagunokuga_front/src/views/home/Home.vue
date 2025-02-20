<template>
  <div id="fullpage">
    <section v-for="(section, index) in sections" :key="index" class="section page beige" :class="{ 'center-text': index === 0}">
      
      <!-- 이미지 -->
      <img v-if="section.contents[2] && section.contents[2].type === 'img'"
        :src="section.contents[2].src" 
        alt="가구놓구가 로고" 
        class="main-image"
        :class="{ 'fade-in': visibleSections[0][0],
                  'left-align': index === 2
         }"
      />

      <!-- 콘텐츠 리스트 -->
      <div v-for="(content, i) in section.contents" :key="i"
        class="content"
        :class="{ 
          'fade-in': i === 0 ? visibleSections[0][0] : visibleSections[0][i], 
          'right-position': index === 2 
        }"
      >
        <component 
          :is="content.type" 
          class="title" 
          v-if="content.type === 'h1' || content.type === 'h2'" 
          v-html="content.text">
        </component>
        <p class="subtitle" v-else-if="content.type === 'p'" v-html="content.text"></p>
        <button class="download-btn heartbeat" v-else-if="content.type === 'button'" @click="content.action">
          {{ content.text }}
        </button>
      </div>

    </section>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useLoginStore } from '../login/login';

const router = useRouter();
const route = useRoute();
const loginStore = useLoginStore();
const currentUser = computed(() => loginStore.state.nickname);

const handleButtonClick = () => {
  if (currentUser.value) {
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
    contents: [
      {type: 'h2', text: '간편하고 정확한 <br> 도면설계부터 가구배치'},
      {type: 'p', text: '제공되는 기본 레이아웃으로 쉽게 시작하고,<br>직관적인 도구로 정확하게 공간을 설계하세요.<br>간단한 드래그로 가구를 배치하고 조정할 수 있습니다.'},
      {type: 'img', src: "/main1.gif"}
    ],
  },
  {
    contents: [
      {type: 'h2', text: '떨어져 있어도 <br> 함께 만드는 우리 집'},
      {type: 'p', text: '실시간 동시 편집으로 함께 가구를 배치하고,<br>채팅으로 즉각적인 피드백을 주고받으세요.'},
      {type: 'img', src: "/main2.gif"}
    ]
  },
  {
    contents: [
      {type: 'h2', text: '공간의 영감을 나누는<br>커뮤니티'},
      {type: 'p', text: '나만의 특별한 공간을 공유하고<br>다양한 아이디어로 영감을 채워보세요.'},
      {type: 'img', src: "/main3.gif"}
    ]
  }
]);

const visibleSections = ref(sections.value.map(section => Array(section.contents.length + 1).fill(false)));

onMounted(() => {
  if (route.path === "/") { // 메인 페이지 경로일 때만 초기화
    initializeFullPage();
  }
});

function initializeFullPage() {
  if (window.$ && window.$.fn.fullpage) {
    window.$(document).ready(function () {
      window.$('#fullpage').fullpage({
        autoScrolling: true,
        navigation: true,
        scrollBar: false,
        scrollingSpeed: 1500,

        afterLoad: function (anchorLink, index) {
          const sectionIndex = index - 1;
          if (!visibleSections.value[sectionIndex].some(v => v)) {
            setTimeout(() => {
              visibleSections.value[sectionIndex][0] = true; // 이미지 먼저 등장
              setTimeout(() => {
                visibleSections.value[sectionIndex][1] = true;
                setTimeout(() => {
                  visibleSections.value[sectionIndex][2] = true;
                  setTimeout(() => {
                    visibleSections.value[sectionIndex][3] = true;
                  }, 500);
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
  if (from.name) {
    window.$('#fullpage').fullpage.destroy('all');
  }
  next();
});
</script>

<style lang="scss" scoped>
@import "./home.css";

</style>
