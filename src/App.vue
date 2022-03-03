<template>
  <div>
    <router-view />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import StoreFactory from './stores/StoreFactory';
  import { ConfigStore } from './stores/ConfigStore';

  export default defineComponent({
    name: 'App',
    setup: () => {},
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
