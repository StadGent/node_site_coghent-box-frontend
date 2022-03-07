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
    :showPauseOverview="showPauseOverview"
  />
  <!-- <mqtt @selectStory="setSelectStory" /> -->
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import ViewPort from '@/components/ViewPort.vue';
import { useQuery } from '@vue/apollo-composable';
import mqtt from '@/components/mqtt.vue';
import StoryService from '@/services/StoryService';
import { SensorObject } from '@/composables/common';
import { GetActiveBoxDocument, RelationType } from 'coghent-vue-3-component-library';
import { useBoxVisiter } from 'coghent-vue-3-component-library';
import { apolloClient } from '@/main';
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
    const visiter = ref<any | null>(null);
    const inputValue = ref<string>('');
    const showPauseOverview = ref<boolean>(false);
    const { getByCode } = useBoxVisiter(apolloClient);

    const { fetchMore } = useQuery(
      GetActiveBoxDocument,
      {},
      { fetchPolicy: 'cache-first' },
    );

    watch(visitercode, async (value) => {
      const activeStories = await fetchMore({});
      stories.value = activeStories?.data.ActiveBox.results;
      const storyRelations = (await useBoxVisiter(apolloClient).getRelationsByType(
        visitercode.value,
        RelationType.Stories,
      )) as Array<Relation>;

      const tmpStoryService = new StoryService(
        stories.value as Array<any>,
        visiter.value,
      );
      tmpStoryService.fillUpDataSources();
      tmpStoryService.mergeVisiterStoryRelationsWithStoryData(storyRelations);
      const storiesToSee = getUnseenStories(
        storyRelations.map((_relation) =>
          tmpStoryService.getStoryDataOfStory(_relation.key.replace('entities/', '')),
        ),
      );
      if (storiesToSee.length > 0) {
        const storyToSet = getFirstStoryToSee(storiesToSee);
        if (storyToSet) {
          tmpStoryService.setActiveStory(storyToSet.storyId);
          storyService.value = tmpStoryService;
        }
      } else {
        const storiesSeen = storyRelations.map((_rel) =>
          _rel.key.replace('entities/', ''),
        ) as Array<string>;
        let storyToSetActive = null;
        stories.value?.forEach((_story) => {
          if (!storiesSeen.includes(_story.id)) {
            storyToSetActive = _story.id as string;
          }
        });
        if (storyToSetActive) {
          tmpStoryService.setActiveStory(storyToSetActive);
          showPauseOverview.value = true;
          storyService.value = tmpStoryService;
        }
      }
    });

    const restartSession = async (start: boolean) => {
      console.log({ start });
      console.log('Restart session');
    };

    const getCode = async (code: string) => {
      const visiterByCode = await getByCode(String(code));
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
      showPauseOverview,
    };
  },
});
</script>