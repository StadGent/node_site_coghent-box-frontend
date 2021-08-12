<template>
  <div class="bg-background-medium">
    <h1>{{ msg }}</h1>
    <div>
      <input
        v-model="keywordInput"
        placeholder="keyword"
      >
      <button @click="getData()">
        Get data
      </button>
    </div>
    <p>Currently in basket:</p>
    <p>
      <span
        v-for="square in basket"
        :key="square.id"
      >{{ square.title.text }}, </span>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, watch } from 'vue'
import { Square } from '../models/SquareModel'

export default defineComponent({
  name: 'TouchHeader',
  props: {
    basket: {
      type: Array as PropType<Square[]>,
      required: true
    },
    keyword: {
      type: String,
      required: true
    },
    msg: {
      type: String,
      required: true
    },
    getData: {
      type: Function,
      required: true
    }
  },
  emits: ['update:keyword'],
  setup: (props, { emit }) => {
    const keywordInput = ref<string>(props.keyword)

    watch(
      () => keywordInput.value,
      (newKeyword: any) => {
        emit('update:keyword', newKeyword)
      }
    )

    watch(
      () => props.keyword,
      (newKeyword: any) => {
        keywordInput.value = newKeyword
      }
    )

    return {
      keywordInput
    }
  }
})

</script>

<style scoped>
</style>
