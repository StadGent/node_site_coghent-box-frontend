<template>
  <ViewPort
    :stories="stories"
    :storySelected="storySelected"
    :storyService="storyService"
    @restartSession="restartSession"
    @resetSelectedStory="resetSelectedStory"
  />
  <mqtt @selectStory="setSelectStory" />
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import ViewPort from '@/components/ViewPort.vue';
import { useQuery } from '@vue/apollo-composable';
import mqtt from '@/components/mqtt.vue';
import { BoxVisiter } from '@/models/GraphqlModel';
import StoryService from '@/services/StoryService';
import { SensorObject } from '@/composables/common';
import { GetActiveBoxDocument } from 'coghent-vue-3-component-library';
import { useBoxVisiter } from 'coghent-vue-3-component-library';
import { apolloClient } from '@/main';
import { boxVisiter } from 'coghent-vue-3-component-library';

export default defineComponent({
  name: 'Wall',
  components: { ViewPort },

  setup() {
    let stories = ref<Array<any>>();
    const storySelected = ref<string>(
      JSON.stringify({ topic: 'sensors/1/present', id: 1, msg: true } as SensorObject),
    );
    const storyService = ref<StoryService>();
    const visitercode = ref<string>('52389932');

    const { onResult: Stories } = useQuery(GetActiveBoxDocument);

    Stories(async (_stories) => {
      console.log({ _stories });
      const activeStories = _stories.data.ActiveBox.results;
      if (activeStories && visitercode.value != '') {
        storyService.value = new StoryService(activeStories, String(visitercode.value));
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

    const getCode = () => {
      const code = prompt('Enter visiter code');
      visitercode.value = String(code)
      useBoxVisiter(apolloClient).getByCode(visitercode.value);
      console.log('get visiter', boxVisiter);
    };

    onMounted(() => {
      // getCode();
    });

    const resetSelectedStory = (_resetTo: SensorObject) =>
      (storySelected.value = JSON.stringify(_resetTo));

    window.onkeydown = async (key: KeyboardEvent) => {
      switch (key.code) {
        case 'Digit1':
          console.log('pressed 1');
          storySelected.value = JSON.stringify({
            topic: 'sensors/1/present',
            id: 1,
            msg: true,
          } as SensorObject);
          break;
        case 'Digit2':
          console.log('pressed 2');
          storySelected.value = JSON.stringify({
            topic: 'sensors/2/present',
            id: 2,
            msg: true,
          } as SensorObject);
          break;
        case 'Digit3':
          console.log('pressed 3');
          storySelected.value = JSON.stringify({
            topic: 'sensors/3/present',
            id: 3,
            msg: true,
          } as SensorObject);
          break;
        case 'Digit4':
          console.log('pressed 4');
          storySelected.value = JSON.stringify({
            topic: 'sensors/4/present',
            id: 4,
            msg: true,
          } as SensorObject);
          break;
        case 'Digit5':
          console.log('pressed 5');
          break;
      }
    };

    const setSelectStory = (sensorValue: { topic: string; id: number; msg: boolean }) => {
      console.log(`MQTT data => `, sensorValue);
      if (sensorValue.topic.includes('present') && sensorValue.msg) {
        storySelected.value = JSON.stringify(sensorValue);
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