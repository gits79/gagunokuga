<script setup>
import { ref } from "vue";
import { useSignupStore } from "./signup";
import TheHeader from "@/components/the-header/TheHeader.vue";  // Pinia Store 임포트
const store = useSignupStore();
</script>

<template>
  <TheHeader />
  <div class="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
    <h1 class="text-2xl font-bold text-center mb-6">회원가입</h1>
    <form @submit.prevent="store.signup">
      <<div class="form-group">
  <label for="nickname">닉네임</label>
  <input
    type="text"
    id="nickname"
    v-model="store.state.nickname"
    placeholder="닉네임을 입력하세요"
    required
  />
  <button type="button" @click="store.checkNickname" :disabled="store.state.isCheckingNickname">
    중복 확인
  </button>
  <span v-if="store.state.nicknameMessage" :class="store.state.isNicknameValid ? 'valid' : 'invalid'">
    {{ store.state.nicknameMessage }}
  </span>
</div>

<!-- 이메일 -->
<div class="form-group">
  <label for="email">이메일</label>
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


      <div class="mb-4">
        <label for="password" class="block text-sm font-medium text-gray-700">비밀번호</label>
        <input
            type="password"
            id="password"
            v-model="store.state.password"
            placeholder="비밀번호를 입력하세요"
            required
            class="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <span v-if="!store.state.isPasswordValid" class="text-red-500 mt-1 text-sm">비밀번호는 최소 8자 이상이어야 합니다.</span>
      </div>

      <div class="mb-6">
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700">비밀번호 확인</label>
        <input
            type="password"
            id="confirmPassword"
            v-model="store.state.confirmPassword"
            placeholder="비밀번호를 다시 입력하세요"
            required
            class="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <span v-if="!store.checkPassword" class="text-red-500 mt-1 text-sm">비밀번호가 일치하지 않습니다.</span>
      </div>

      <button type="submit" :disabled="store.state.isSubmitting" class="w-full py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:bg-gray-300">
        회원가입
      </button>
    </form>
  </div>
</template>


<style scoped>
.valid {
  color: green;
}
.invalid {
  color: red;
}
</style>
