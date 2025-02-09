<script setup>
import { onMounted } from 'vue';
import { useLoginStore } from './login';
import { useRoute, useRouter } from 'vue-router';

const loginStore = useLoginStore();
const route = useRoute();
const router = useRouter();

onMounted(() => {
  const token = route.query.token;
  if (token) {
    loginStore.handleLoginSuccess(token);
  } else {
    router.push('/login');
  }
});
</script>

<template>
    <div>처리중...</div>
</template>


<style lang="scss" scoped>

</style>