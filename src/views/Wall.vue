<template>
  <label :v-if="visitercode == null" for="">
    <input type="text" v-model="inputValue" /><button @click="getCode(inputValue)">
      Submit
    </button>
  </label>
  <ViewPort
    :stories="stories"
    :storySelected="storySelected"
    :storyService="storyService"
    @restartSession="restartSession"
    @resetSelectedStory="resetSelectedStory"
  />
  <!-- <mqtt @selectStory="setSelectStory" /> -->
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
import { Relation } from 'coghent-vue-3-component-library/lib/queries';
import { getFirstStoryToSee, getUnseenStories } from '@/composables/useBox';

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
    const visiter = ref<BoxVisiter | null>(null);
    const inputValue = ref<string>('');

    const { fetchMore } = useQuery(GetActiveBoxDocument);

    watch(visitercode, async (value) => {
      const activeStories = await fetchMore({});
      stories.value = activeStories?.data.ActiveBox.results;
      console.log('stories after code set', stories.value);
      const storyRelations = (await useBoxVisiter(apolloClient).getRelationsByType(
        visitercode.value,
        RelationType.Stories,
      )) as Array<Relation>;
      const storiesToSee = getUnseenStories(storyRelations);
      const storyToSet = getFirstStoryToSee(storiesToSee);
      if (storyToSet) {
        console.log({ storyToSet });
        const tmpStoryService = new StoryService(
          stories.value as Array<any>,
          String(visitercode.value),
        );
        tmpStoryService.setActiveStory(storyToSet.key.replace('entities/',''))
        storyService.value = tmpStoryService
      }else{
        console.log('All stories seen')
      }
    });

    const restartSession = async (start: boolean) => {
      console.log({ start });
      console.log('Restart session');
    };

    const getCode = async (code: string) => {
      // code = '71181823'
      const visiterByCode = await useBoxVisiter(apolloClient).getByCode(String(code));
      console.log('visiter', visiter);
      if (visiterByCode != null) {
        visitercode.value = String(code);
        visiter.value = visiterByCode;
      }
    };

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
      inputValue,
      getCode,
    };
  },
});
</script>