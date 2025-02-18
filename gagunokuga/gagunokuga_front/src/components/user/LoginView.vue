<template>
  <div class="login-container">
    <h1>로그인</h1>
    <form @submit.prevent="onSubmit">
      <div class="form-group">
        <label for="email">이메일</label>
        <input type="email" id="email" v-model="email" placeholder="이메일을 입력하세요" required />
      </div>
      <div class="form-group">
        <label for="password">비밀번호</label>
        <input type="password" id="password" v-model="password" placeholder="비밀번호를 입력하세요" required />
      </div>
      <button type="submit">로그인</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    onSubmit() {
      // 로그인 처리 로직 (예: API 요청)
      if (this.email && this.password) {
        alert(`로그인 시도: ${this.email}`);
        // 이후 로직 추가 (예: Vuex, API 연동)
      } else {
        alert('이메일과 비밀번호를 입력해주세요.');
      }
    },
  },
};
</script>

<style>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>