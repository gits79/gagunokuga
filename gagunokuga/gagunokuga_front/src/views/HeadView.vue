<template>
  <header class="navbar">
    <nav>
      <ul>
        <li><router-link to="/">메인</router-link></li>
        <li><router-link to="/login">로그인</router-link></li>
        <li><router-link to="/signup">회원가입</router-link></li>
        <li><router-link to="/room">룸 소개</router-link></li>
        <li><router-link to="/articles">게시판</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<script>
export default {};
</script>

<style>
.navbar {
  background-color: black;
  color: white;
  padding: 10px;
}
.navbar ul {
  list-style: none;
  display: flex;
  gap: 15px;
  margin: 0;
  padding: 0;
}
.navbar a,
.navbar .router-link-active {
  color: white;
  text-decoration: none;
}
</style>