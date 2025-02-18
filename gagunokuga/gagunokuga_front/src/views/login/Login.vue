<script setup>
import { useLoginStore } from './login';  

const loginStore = useLoginStore();  // 로그인 상태를 초기화

const handleKakaoLogin = () => {
  loginStore.kakaoLogin();
};

const handlePasswordReset = () => {
  loginStore.passwordReset(loginStore.state.email);  
};

const toggleModal = () => {
  loginStore.state.showModal = !loginStore.state.showModal;  
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <h2>로그인</h2>
   <form @submit.prevent="loginStore.login">
     <div class="form-group">
       <label for="email">이메일</label>
       <input v-model="loginStore.state.email" type="email" id="email" required placeholder="이메일을 입력하세요" />
     </div>
     <div class="form-group">
       <label for="password">비밀번호</label>
       <input v-model="loginStore.state.password" type="password" id="password" required placeholder="비밀번호를 입력하세요" />
     </div>
     <div class="button-container">
       <button type="submit">로그인</button>
       <div class="kakao-login">
         <button @click.prevent="handleKakaoLogin">
           <img src="@/assets/login/kakaoLogin.png" alt="카카오 로그인" />
         </button>
       </div>
     </div>
   </form>
   <div class="links">
     <button @click="toggleModal" class="link">비밀번호 찾기</button>
     /
     <router-link to="/signup" class="link">회원가입</router-link>
   </div>
 </div>
 </div>
  <!-- 모달 창 -->
  <div v-if="loginStore.state.showModal" class="modal-overlay" @click.self="toggleModal">
    <div class="modal">
      <h3>비밀번호 재설정</h3>
      <div class="form-group">
        <label for="reset-email">이메일</label>
        <input v-model="loginStore.state.email" type="email" id="reset-email" required placeholder="이메일을 입력하세요" />
      </div>
      <button @click="handlePasswordReset">전송</button>
      <button @click="toggleModal" class="close-modal">닫기</button>
    </div>
  </div>
</template>

<style scoped>
@import "./login.css";
</style>
