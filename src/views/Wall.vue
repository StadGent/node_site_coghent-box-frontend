<template>
  <ViewPort :stories="stories" :storySelected="storySelected"/>
  <!-- <mqtt @selectStory="setSelectStory"/> -->
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import ViewPort from '@/components/ViewPort.vue';
import { useMutation, useQuery } from '@vue/apollo-composable';
import { SearchFilter } from 'coghent-vue-3-component-library/lib/queries';
import { GetStoriesDocument, CreationOfBoxVisitorDocument, GetBoxVisitersDocument } from 'coghent-vue-3-component-library';
import mqtt from '@/components/mqtt.vue';

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
    const val = ref<any>();

    const { onResult: Stories } = useQuery(GetStoriesDocument,{searchValue: searchValue})
    const {onResult: BoxVisiters} = useQuery(GetBoxVisitersDocument);
    

    BoxVisiters((visiters) => {
      console.log({visiters});
    });
    Stories((entities) => {
      const activeStories = entities.data.Entities?.results;
      if (activeStories) {
        stories.value = [...activeStories];
        console.log(`=> Stories <=`, entities);
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
        }
      };
      const setSelectStory = (sensorValue: {id: number, msg: boolean}) => {
        console.log(`MQTT data => `, sensorValue)
        if(sensorValue.msg){
          storySelected.value = sensorValue.id;
        }
      }

      // onMounted(async () => {
      //   const d = await mutate();
      //   console.log(d);
      // })

    return {
      stories,
      storySelected,
      setSelectStory,
    };
  },
});
</script>