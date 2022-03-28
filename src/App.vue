<template>
  <div>
    <router-view :key="route.fullPath" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { useRoute } from 'vue-router';

  export default defineComponent({
    name: 'App',
    setup: () => {
      const route = useRoute();

      return { route };
    },
  });
</script>

<style>
  body {
    margin: 0;
  }
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
