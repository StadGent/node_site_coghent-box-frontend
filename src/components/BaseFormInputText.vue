<template>
  <input
    type="text"
    :value="value"
    :placeholder="[[ placeholder ]]"
    @input="onChange"
  >
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'BaseFormInputText',
  props: {
    value: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      required: false,
      default: ''
    },
    onChange: {
      type: Function,
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
