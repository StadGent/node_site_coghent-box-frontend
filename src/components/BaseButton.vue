<template>
  <button
    class="
      py-2
      px-4
      mx-2
      text-text-white
      bg-accent-purple
      rounded-full
      shadow-lg
      font-bold
    "
    @click="onClick()"
  >
    {{ text }}
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BaseButton',
  props: {
    text: {
      type: String,
      required: true,
    },
    onClick: {
      type: Function,
      required: true,
    },
  },
  emits: [],
  setup: (props, { emit }) => {
    return {};
  },
});
</script>

<style scoped>
</style>
