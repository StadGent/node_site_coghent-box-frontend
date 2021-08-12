<template>
  <div class="bg-background-medium text-center py-3">
    <BaseTitle :text="msg" />
    <div>
      <input
        v-model="keywordInput"
        placeholder="keyword"
        class="my-2"
      >
      <BaseButton :onClick="getData" text="Get data"/>
    </div>
    <p class="mt-2">Currently in basket:</p>
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
import BaseTitle from './BaseTitle.vue'
import BaseButton from './BaseButton.vue'

export default defineComponent({
  name: 'TouchHeader',
  components: {
    BaseTitle,
    BaseButton
  },
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
