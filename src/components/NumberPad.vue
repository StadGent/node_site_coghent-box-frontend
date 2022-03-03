<template>
  <div class="w-full flex justify-center">
    <section :class="containerStyles">
      <div
        v-for="(key, index) in keys"
        :key="index"
        :class="key.type == 'number' || key.type == 'icon' ? keyStyles : spacerStyles"
        @click="addCharacterToResultArray(key)"
      >
        <p v-if="key.type == 'number'">{{ key.value }}</p>
        <base-icon
          v-if="key.type == 'icon'"
          :icon="key.value"
          class="stroke-current stroke-2"
        />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref, watch } from 'vue';
  import { BaseIcon } from 'coghent-vue-3-component-library';
  import { useRouter } from 'vue-router';

  type Key = {
    key: string;
    value: string;
    backKey?: boolean;
  };

  export default defineComponent({
    name: 'NumberPad',
    components: { BaseIcon },
    props: {
      keys: {
        type: Array,
        required: false,
        default: () => [
          { type: 'number', value: '7' },
          { type: 'number', value: '8' },
          { type: 'number', value: '9' },
          { type: 'number', value: '4' },
          { type: 'number', value: '5' },
          { type: 'number', value: '6' },
          { type: 'number', value: '1' },
          { type: 'number', value: '2' },
          { type: 'number', value: '3' },
          { type: 'spacer', value: '' },
          { type: 'number', value: '0' },
          { type: 'icon', value: 'arrowLeft', backKey: true },
        ],
      },
      columns: {
        type: Number,
        required: false,
        default: 3,
      },
      maxAmountOfCharacters: {
        type: Number,
        required: false,
        default: 8,
      },
    },
    emits: ['code', 'codeComplete'],
    setup: (props, { emit }) => {
      const valueArray = ref<Array<any>>([]);
      const containerStyles: string = `grid grid-cols-${props.columns} w-1/2`;
      const spacerStyles: string = '';
      const keyStyles: string =
        'flex justify-center items-center bg-background-light p-5 m-5 text-3xl font-bold rounded-md cursor-pointer select-none w-24 h-24';

      const resetCode = () => {
        valueArray.value = [];
      };

      const addCharacterToResultArray = (key: Key) => {
        if (key.backKey) {
          valueArray.value.pop();
          emit('code', valueArray.value);
        } else {
          if (valueArray.value.length < props.maxAmountOfCharacters - 1) {
            valueArray.value.push(key.value);
            emit('code', valueArray.value);
          } else if ((valueArray.value.length = props.maxAmountOfCharacters - 1)) {
            valueArray.value.push(key.value);
            emit('codeComplete', true);
            resetCode();
          }
        }
      };

      return { spacerStyles, keyStyles, containerStyles, addCharacterToResultArray };
    },
  });
</script>

<style scoped></style>
