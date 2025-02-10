<script setup>
import { ref } from "vue";
import { useSignupStore } from "./signup";
const store = useSignupStore();
</script>

<template>
  <div class="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
    <h1 class="text-2xl font-bold text-center mb-6">회원가입</h1>
    <form @submit.prevent="store.signup">
      <div class="mb-4">
        <label for="nickname" class="block text-sm font-medium text-gray-700">닉네임</label>
        <input
            type="text"
            id="nickname"
            v-model="store.state.nickname"
            placeholder="닉네임을 입력하세요"
            required
            class="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <button type="button" @click="store.checkNickname" :disabled="store.state.isCheckingNickname" class="mt-2 px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:bg-gray-300">
          중복 확인
        </button>
        <span v-if="store.state.nicknameMessage" :class="store.state.isNicknameValid ? 'text-green-500' : 'text-red-500'" class="mt-1 text-sm">
          {{ store.state.nicknameMessage }}
        </span>
      </div>

      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700">이메일</label>
        <input
            type="email"
            id="email"
            v-model="store.state.email"
            placeholder="이메일을 입력하세요"
            required
            class="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <div class="flex space-x-2 mt-2">
          <button type="button" @click="store.checkEmailDuplicate" class="w-1/2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
            이메일 중복 확인
          </button>
          <button type="button" @click="store.sendVerificationCode" class="w-1/2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
            인증번호 발송
          </button>
        </div>
        <div v-if="store.state.showVerificationInput" class="mt-4">
          <label for="verificationCode" class="block text-sm font-medium text-gray-700">인증번호</label>
          <input
              type="text"
              id="verificationCode"
              v-model="store.state.verificationCode"
              placeholder="인증번호를 입력하세요"
              required
              class="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <button type="button" @click="store.verifyEmail" class="mt-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
            인증 확인
          </button>
        </div>
        <span v-if="store.state.emailMessage" :class="store.state.isEmailVerified ? 'text-green-500' : 'text-red-500'" class="mt-1 text-sm">
          {{ store.state.emailMessage }}
        </span>
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
