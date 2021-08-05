<template>
  <div>
    <TouchTable msg="Touchtable" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TouchTable from './views/TouchTable.vue'

export default defineComponent({
  name: 'App',
  components: {
    TouchTable,
  }
})
</script>

<style>
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding-top: 20px;
  background-color: black;
}
</style>
