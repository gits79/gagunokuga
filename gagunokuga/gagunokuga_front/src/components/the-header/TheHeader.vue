<script setup>
</script>

<template>
  <header>
    <nav>
      <ul>
        <li><router-link to="/">홈</router-link></li>
        <li><router-link to="/login">로그인</router-link></li>
        <li><router-link to="/signup">회원가입</router-link></li>
        <li><router-link to="/room-list">룸목록</router-link></li>
        <li><router-link to="/editor/-1">도면에디터(임시)</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
  @import "./TheHeader.css";
</style>
  