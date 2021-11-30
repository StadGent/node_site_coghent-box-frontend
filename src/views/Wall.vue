<template>
  <ViewPort :stories="stories" :storySelected="storySelected"/>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import ViewPort from '@/components/ViewPort.vue';
import { useQuery } from '@vue/apollo-composable';
import { SearchFilter  } from 'coghent-vue-3-component-library/lib/queries';
import { GetStoriesDocument  } from 'coghent-vue-3-component-library';

export default defineComponent({
  name: 'Wall',
  components: { ViewPort },

  setup() {
    const searchValue: SearchFilter = {
      value: 'story',
      key: 'type',
      isAsc: true,
      relation_filter: [],
    };
    let stories = ref<Array<any>>();
    const storySelected = ref<number>(1);

    const { onResult: Stories } = useQuery(GetStoriesDocument,{searchValue: searchValue})

    Stories((entities) => {
      const activeStories = entities.data.Entities?.results;
      if (activeStories) {
        stories.value = [...activeStories];
      }
    });

     window.onkeydown = (key: KeyboardEvent) => {
        switch(key.code){
          case 'Digit1':
            console.log('pressed 1');
            storySelected.value = 1;
            break;
          case 'Digit2':
            console.log('pressed 2');
            storySelected.value = 2;
            break;
          case 'Digit3':
            console.log('pressed 3');
            storySelected.value = 3;
            break;
          case 'Digit4':
            console.log('pressed 4');
            storySelected.value = 4;
            break;
          case 'Digit5':
            console.log('pressed 5');
            storySelected.value = 5;
            break;
          default:
            console.log(key);
        }
      };

    return {
      stories,
      storySelected,
    };
  },
});
</script>