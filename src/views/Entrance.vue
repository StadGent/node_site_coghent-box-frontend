<template>
  <Introscherm1 nextPath="/intro-2"/>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import Introscherm1 from '@/components/Introscherm1.vue';
export default defineComponent({
  name: 'Entrance',
  components: { Introscherm1 },
  setup() {},
});
</script>

<style>

</style>
