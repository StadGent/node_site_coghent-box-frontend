<template>
  <div class="bg-background-medium text-center py-3">
    <BaseTitle :text="msg" />
    <div>
      <BaseFormInputText
        :value="keyword"
        :onChange="onChange"
        placeholder="keyword"
      />
      <BaseButton 
        :on-click="getData"
        text="Get data!"
      />
    </div>
    <p class="mt-2">
      Currently in basket:
    </p>
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
import BaseFormInputText from './BaseFormInputText.vue'

export default defineComponent({
  name: 'TouchHeader',
  components: {
    BaseTitle,
    BaseButton,
    BaseFormInputText
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
    const onChange = (e: any) => {
      emit('update:keyword', e.currentTarget.value)
    }

    return {
      onChange
    }
  }
})

</script>

<style scoped>
</style>
