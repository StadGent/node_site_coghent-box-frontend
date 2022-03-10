<template>
  <section
    class="flex justify-center items-Center text-text-white w-full font-bold text-3xl"
  >
    <div
      v-for="index in maxAmountOfCharacters"
      :key="index"
      class="p-3"
    >
      <p v-if="code[index - 1]">
        {{ code[index - 1] }}
      </p>
      <p v-else>
        .
      </p>
    </div>
  </section>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref, watch } from 'vue';

  export default defineComponent({
    name: 'NumberDisplay',
    components: {},
    props: {
      code: {
        type: Array,
        required: true,
      },
      maxAmountOfCharacters: {
        type: Number,
        required: true,
      },
    },
    setup: (props) => {},
  });
</script>

<style scoped></style>
