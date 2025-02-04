<template>
  <div id="app">
    <HeadView />
    <main>
      <router-view />
    </main>
    <TailView />
  </div>
</template>

<script>
import HeadView from './views/HeadView.vue';
import TailView from './views/TailView.vue';

export default {
  components: {
    HeadView,
    TailView,
  },
};
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

main {
  flex: 1; /* 화면 대부분을 차지하도록 설정 */
  overflow: auto;
}
</style>
