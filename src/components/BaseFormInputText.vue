<template>
  <input
    v-model="keywordInput"
    :placeholder="placeholder"
  >
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BaseFormInputText',
  props: {
    text: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      required: false
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
