<template>
  <ViewPort :stories="stories" :storySelected="storySelected"/>
  <!-- <mqtt @selectStory="setSelectStory"/> -->
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import ViewPort from '@/components/ViewPort.vue';
import { useMutation, useQuery } from '@vue/apollo-composable';
import { SearchFilter } from 'coghent-vue-3-component-library/lib/queries';
import { GetStoriesDocument, GetBoxVisitersDocument, GetBoxVisiterByCodeDocument, AddFrameToVisiterDocument } from 'coghent-vue-3-component-library';
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

    const { onResult: Stories } = useQuery(GetStoriesDocument)
    // const {onResult: BoxVisiters} = useQuery(GetBoxVisitersDocument);
    // const {onResult: BoxVisiter} = useQuery(GetBoxVisiterByCodeDocument, {code: "7682136782315678231657"});
    // const { mutate, onDone } = useMutation(AddFrameToVisiterDocument, {variables: {visiterId: "3c3d73ed-584d-4ad0-9708-77da1d5464d2", frameId: "95072acc-b835-4bfe-84b3-1cc102efff34"}})
    
    // BoxVisiters(async (visiters) => {
    //   console.log({visiters});
    //   const relations = await mutate();
    // console.log({relations});
    // });
    // BoxVisiter((visiter) => {
    //   console.log({visiter});
    // });

    // onDone((_relations) => {
    //   console.log({_relations});
    // })
    Stories((_stories) => {
      console.log({_stories});
      const activeStories = _stories.data.Stories.results;
      if (activeStories) {
        stories.value = [...activeStories];
        console.log(`=> Stories <=`, _stories);
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