<template>
  <!-- <Introscherm1 nextPath="/intro-2"/> -->
  <!-- <Introscherm2 nextPath="/intro-3"/> -->
  <Introscherm3
    :storyTitle="`Opkomst van de Turkse handelaars`"
    :storyColor="`bg-neutral-400`"
    nextPath="/intro-3"
  />
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import Introscherm1 from '@/components/Introscherm1.vue';
import Introscherm2 from '@/components/Introscherm2.vue';
import Introscherm3 from '@/components/Introscherm3.vue';
export default defineComponent({
  name: 'Entrance',
  components: { Introscherm3 },
  setup() {},
});
</script>

<style>
</style>
