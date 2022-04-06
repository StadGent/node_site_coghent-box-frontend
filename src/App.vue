<template>
  <div>
    <router-view />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute } from 'vue-router';

  export default defineComponent({
    name: 'App',
    setup: () => {
      const route = useRoute();
      const { t } = useI18n();

      return { route, t };
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
