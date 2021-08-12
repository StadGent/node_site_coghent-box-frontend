<template>
    <h1 class='py-4 text-2xl font-bold'>{{ text }}</h1>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BaseTitle',
  props: {
    text: {
      type: String,
      required: true
    }
  },
  emits: [],
  setup: (props, { emit }) => {
    return {
      
    }
  }
})

</script>

<style scoped>
</style>
