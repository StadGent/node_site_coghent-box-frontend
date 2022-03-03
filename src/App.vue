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
    setup: (props) => {
      const configStore = StoreFactory.get(ConfigStore);
      const config = fetch('../config.json').then((r) => r.json());
      config.then((result) => configStore.setConfig(result));
      console.log(config);
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
