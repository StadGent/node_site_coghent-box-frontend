<template>
  <ViewPort
    :stories="stories"
    :storySelected="storySelected"
    :storyService="storyService"
  />
  <!-- <mqtt @selectStory="setSelectStory"/> -->
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import ViewPort from '@/components/ViewPort.vue';
import { useMutation, useQuery } from '@vue/apollo-composable';
import {
  GetStoriesDocument,
  GetBoxVisiterByCodeDocument,
  AddFrameToVisiterDocument,
} from 'coghent-vue-3-component-library';
import mqtt from '@/components/mqtt.vue';
import { BoxVisiter } from '@/models/GraphqlModel';
import StoryService from '@/services/StoryService';

export default defineComponent({
  name: 'Wall',
  components: { ViewPort },

  setup() {
    let stories = ref<Array<any>>();
    const storySelected = ref<number>(1);
    let visiter: BoxVisiter;
    let storyService = ref<StoryService>();

    // const { onResult: BoxVisiter } = useQuery(GetBoxVisiterByCodeDocument, {
    //   code: 'eaedf3ab-4de9-473f-9668-5e3e6d5b0510',
    // });
    const { onResult: Stories } = useQuery(GetStoriesDocument);
    // const { mutate, onDone } = useMutation(AddFrameToVisiterDocument, {variables: {visiterId: "eaedf3ab-4de9-473f-9668-5e3e6d5b0510"}})

    // BoxVisiter((_visiter) => {
    //   visiter = _visiter.data.BoxVisiterByCode as BoxVisiter;
    //   console.log(visiter);
    // });

    // onDone((_relations) => {
    //   console.log({_relations});
    // })
    Stories(async (_stories) => {
      console.log({ _stories });
      const activeStories = _stories.data.Stories.results;
      if (activeStories) {
        storyService.value = new StoryService(
          activeStories,
          'eaedf3ab-4de9-473f-9668-5e3e6d5b0510',
        );
        stories.value = [...activeStories];
        console.log(`=> Stories <=`, _stories);
      }
    });

    window.onkeydown = (key: KeyboardEvent) => {
      switch (key.code) {
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
    const setSelectStory = (sensorValue: { id: number; msg: boolean }) => {
      console.log(`MQTT data => `, sensorValue);
      if (sensorValue.msg) {
        storySelected.value = sensorValue.id;
      }
    };

    // onMounted(async () => {
    //   const d = await mutate();
    //   console.log(d);
    // })

    return {
      stories,
      storySelected,
      setSelectStory,
      storyService,
    };
  },
});
</script>