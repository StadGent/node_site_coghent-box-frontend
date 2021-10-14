<template>
  <h1>Wall</h1>
  <ViewPort />
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import ViewPort from '@/components/ViewPort.vue';

export default defineComponent({
  name: 'Wall',
  components: { ViewPort },
  setup() {},
});
</script>