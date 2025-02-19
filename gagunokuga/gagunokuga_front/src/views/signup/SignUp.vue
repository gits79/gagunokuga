<script setup>
  import { ref, watch } from "vue";
  import { useSignupStore } from "./signup";  // Pinia Store 임포트
  const store = useSignupStore();

  // 닉네임 길이 제한 적용
  watch(() => store.state.nickname, (newVal) => {
    if (newVal.length > 16) {
      store.state.nickname = newVal.slice(0, 16);
    }
  });
</script>

<template>
 <div class="signup-container">
    <div class="signup-box">
      <h1>회원가입</h1>
      <form @submit.prevent="store.signup">
        <!-- 닉네임 -->
        <div class="form-group">
          <label for="nickname">닉네임</label>
          <div class="input-button-wrapper">
            <input
              type="text"
              id="nickname"
              v-model="store.state.nickname"
              placeholder="닉네임을 입력하세요"
              required
            />
            <p v-if="store.state.nickname.length >= 16" class="error-message">
              닉네임은 최대 16자까지 입력 가능합니다.
            </p>
            <button type="button" @click="store.checkNickname" :disabled="store.state.isCheckingNickname">
              중복 확인
            </button>
          </div>
          <span v-if="store.state.nicknameMessage" :class="store.state.isNicknameValid ? 'valid' : 'invalid'">
            {{ store.state.nicknameMessage }}
          </span>
        </div>

        <!-- 이메일 -->
        <div class="form-group">
          <label for="email">이메일</label>
          <div class="input-button-wrapper">
            <input
              type="email"
              id="email"
              v-model="store.state.email"
              placeholder="이메일을 입력하세요"
              required
            />
            <button type="button" @click="store.checkEmail" :disabled="store.state.isCheckingEmail">
              중복 확인
            </button>
          </div>
          <span v-if="store.state.emailMessage" :class="store.state.isEmailValid ? 'valid' : 'invalid'">
            {{ store.state.emailMessage }}
          </span>

        <!-- 이메일 중복 확인 후 인증번호 발송 버튼 활성화 -->
        <button type="button" @click="store.sendVerificationCode" :disabled="!store.state.isEmailValid">
          인증번호 발송
        </button>

        <div v-if="store.state.showVerificationInput">
          <label for="verificationCode">인증번호</label>
          <input
            type="text"
            id="verificationCode"
            v-model="store.state.verificationCode"
            placeholder="인증번호를 입력하세요"
            required
          />
          <button type="button" @click="store.verifyEmail">인증 확인</button>
        </div>
      </div>


      <div class="form-group">
        <label for="password">비밀번호</label>
        <input
          type="password"
          id="password"
          v-model="store.state.password"
          placeholder="비밀번호를 입력하세요"
          required
        />
        <span v-if="!store.state.isPasswordValid" class="invalid">비밀번호는 최소 8자 이상이어야 합니다.</span>
      </div>

      <div class="form-group">
        <label for="confirmPassword">비밀번호 확인</label>
        <input
          type="password"
          id="confirmPassword"
          v-model="store.state.confirmPassword"
          placeholder="비밀번호를 다시 입력하세요"
          required
        />
        <span v-if="!store.checkPassword" class="invalid">비밀번호가 일치하지 않습니다.</span>
      </div>

      <button 
        type="submit" 
        :disabled="
          store.state.isSubmitting || 
          !store.state.isEmailVerified || 
          !store.state.isNicknameValid || 
          !store.state.isPasswordValid || 
          !store.checkPassword
        "
      >회원가입</button>
    </form>
  </div>
  </div>
</template>


<style scoped>
@import "./signup.css";
</style>
