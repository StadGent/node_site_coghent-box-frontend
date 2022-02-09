<template>
  <ViewPort
    :stories="stories"
    :storySelected="storySelected"
    :storyService="storyService"
    @restartSession="restartSession"
    @resetSelectedStory="resetSelectedStory"
  />
  <mqtt @selectStory="setSelectStory"/>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import ViewPort from '@/components/ViewPort.vue';
import { useMutation, useQuery } from '@vue/apollo-composable';
import {
  GetStoriesDocument,
  GetBoxVisiterByIdDocument,
  AddFrameToVisiterDocument,
} from 'coghent-vue-3-component-library';
import mqtt from '@/components/mqtt.vue';
import { BoxVisiter } from '@/models/GraphqlModel';
import StoryService from '@/services/StoryService';

export default defineComponent({
  name: 'Wall',
  components: { ViewPort, mqtt },

  setup() {
    let stories = ref<Array<any>>();
    const storySelected = ref<number>(1);
    let visiter: BoxVisiter;
    const storyService = ref<StoryService>();

    // const { onResult: BoxVisiter, fetchMore: GetVisiter } = useQuery(
    //   GetBoxVisiterByIdDocument,
    //   {
    //     id: '743ca110-384a-43f7-a57b-796cbd89c8cb',
    //   },
    // );
    const { onResult: Stories } = useQuery(GetStoriesDocument);
    // const { mutate, onDone } = useMutation(AddFrameToVisiterDocument, {variables: {visiterId: "eaedf3ab-4de9-473f-9668-5e3e6d5b0510"}})

    // BoxVisiter((_visiter) => {
    //   console.log({_visiter});
    //   visiter = _visiter.data.BoxVisiterById as BoxVisiter;
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
          '8c9836ce-3540-4d62-b16a-4112df237b76',
        );
        stories.value = [...activeStories];
        console.log(`=> Stories <=`, _stories);
      }
    });

    const restartSession = async (start: boolean) => {
      console.log({ start });
      console.log('Restart session');
      // const _visiter = await GetVisiter({
      //   variables: { code: 'b5e5034f-07c7-4b5c-8855-0ac3d04c62c0' },
      //   updateQuery: (prevVisiter, { fetchMoreResult }) => {
      //     return fetchMoreResult;
      //   },
      // });
      // console.log({_visiter});
    };

    const resetSelectedStory = (resetTo: number) => storySelected.value = resetTo;

    window.onkeydown = async (key: KeyboardEvent) => {
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
          break;
      }
    };

    const setSelectStory = (sensorValue: { topic: string, id: number; msg: boolean }) => {
      console.log(`MQTT data => `, sensorValue);
      if (sensorValue.msg) {
        storySelected.value = sensorValue.id;
      }
    };

    return {
      stories,
      storySelected,
      setSelectStory,
      storyService,
      restartSession,
      resetSelectedStory,
    };
  },
});
</script>