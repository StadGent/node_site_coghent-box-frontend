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
import { defineComponent, onMounted, ref, watch } from 'vue';
import ViewPort from '@/components/ViewPort.vue';
import { useQuery } from '@vue/apollo-composable';
import mqtt from '@/components/mqtt.vue';
import { BoxVisiter } from '@/models/GraphqlModel';
import StoryService from '@/services/StoryService';
import { SensorObject } from '@/composables/common';
import { GetActiveBoxDocument, RelationType } from 'coghent-vue-3-component-library';
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
    const visitercode = ref<string | null>(null);
    const { selectedStory } = useBoxVisiter();

    const { fetchMore } = useQuery(GetActiveBoxDocument);

    watch(visitercode, async (value) => {
      console.log('value of getvisiter', value);
      const activeStories = await fetchMore({});
      stories.value = activeStories?.data.ActiveBox.results;
      storyService.value = new StoryService(
        stories.value as Array<any>,
        String(visitercode.value),
      );
    });

    const restartSession = async (start: boolean) => {
      console.log({ start });
      console.log('Restart session');
    };

    const getCode = async () => {
      const code = prompt('Enter visiter code');
      console.log('INPUT', String(code));
      const visiter = await useBoxVisiter(apolloClient).getByCode(String(code));
      if (visiter == null) {
        await getCode();
      } else {
        visitercode.value = String(code);
        console.log('visiter', visiter);
      }
    };

    onMounted(async () => {
      getCode();
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