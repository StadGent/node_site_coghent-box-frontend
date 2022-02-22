<template>
<section class="flex w-full justify-center align-center text-3xl font-bold rounded-full">
    <div v-for="(number, index) in codeNumberArray" :key="index" class="p-6 number-container mx-3 flex justify-center items-center">
        <p>{{number}}</p>
    </div>
</section>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';

export default defineComponent({
  name: 'BoxVisitCode',
  components: {
      
  },
  props: {
      code: {
        type: String,
        required: true,
      }
  },
  setup: (props) => {
      const codeNumberArray = ref<Array<number>>([])
      
      const numberArray = props.code.split('').map((number) => {
          return Number(number)
      })
      codeNumberArray.value = numberArray

    return {
        codeNumberArray
    }

  },
});
</script>

<style scoped>
.number-container{
    background-color: #F0EDE6;
}
</style>
