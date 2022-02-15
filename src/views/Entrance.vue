<template>
  <router-view/>
</template>
<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Entrance',
  components: {},
  setup() {
    const router = useRouter()
    onMounted(() => {
      router.push({name: 'entrance.step1'})
    })
  },
}); 
</script>

<style>
</style>
