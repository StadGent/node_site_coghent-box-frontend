<template>
  <div class="w-full flex justify-center">
    <section :class="containerStyles">
      <div
        v-for="(key, index) in keys"
        :key="index"
        :class="key.type == 'number' || key.type == 'icon' ? keyStyles : spacerStyles"
        @click="addCharacterToResultArray(key)"
      >
        <p v-if="key.type == 'number'">
          {{ key.value }}
        </p>
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
  import { defineComponent, onMounted, PropType, ref, watch } from 'vue';
  import { BaseIcon } from 'coghent-vue-3-component-library';
  import { useRouter } from 'vue-router';

  type Key = {
    key: string;
    value: string;
    backKey?: boolean;
  };

  export type CodeState = Array<string>;

  export type NumberPadType = {
    state: CodeState;
  };

  const NumberPadState = ref<NumberPadType>({
    state: [],
  });

  export const useNumberPad = () => {
    const updateNumberPad = (NumberPadInput: string) => {
      NumberPadState.value.state.push(NumberPadInput);
    };

    const resetNumberPad = () => {
      NumberPadState.value.state = [];
    };

    const undoNumberPad = () => {
      NumberPadState.value.state.pop();
    };

    return {
      updateNumberPad,
      NumberPadState,
      resetNumberPad,
      undoNumberPad,
    };
  };

  export default defineComponent({
    name: 'NumberPad',
    components: { BaseIcon },
    props: {
      keys: {
        type: Array as PropType<Key[]>,
        required: false,
        default: () => [
          { type: 'number', value: '1' },
          { type: 'number', value: '2' },
          { type: 'number', value: '3' },
          { type: 'number', value: '4' },
          { type: 'number', value: '5' },
          { type: 'number', value: '6' },
          { type: 'number', value: '7' },
          { type: 'number', value: '8' },
          { type: 'number', value: '9' },
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
    emits: ['codeComplete'],
    setup: (props, { emit }) => {
      const { updateNumberPad, undoNumberPad, resetNumberPad, NumberPadState } =
        useNumberPad();
      const containerStyles: string = `grid grid-cols-${props.columns} w-4/10`;
      const spacerStyles: string = '';
      const keyStyles: string =
        'flex justify-center items-center bg-background-light p-5 m-2 text-3xl font-bold rounded-md cursor-pointer select-none w-24 h-24';

      const addCharacterToResultArray = (key: Key) => {
        if (key.backKey) {
          undoNumberPad();
        } else {
          if (NumberPadState.value.state.length <= props.maxAmountOfCharacters - 1) {
            updateNumberPad(key.value);
          }
        }
      };

      return { spacerStyles, keyStyles, containerStyles, addCharacterToResultArray };
    },
  });
</script>

<style scoped></style>
