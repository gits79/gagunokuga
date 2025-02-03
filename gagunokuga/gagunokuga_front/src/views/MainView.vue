<template>
  <main class="main-content">
    <div class="container">
      <AboutView></AboutView>
    </div>
  </main>
</template>

<script>
import AboutView from "./AboutView.vue";
export default {
  components: {
    AboutView
  }
};
</script>

<style>
.main-content {
  flex: 1;
  padding: 20px;
}
</style>