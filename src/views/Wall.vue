<template>
  <label class="absolute left-0 top-0" :v-if="visitercode == null" for="">
    <input v-model="inputValue" class="z-50 relative" type="text" autofocus />
  </label>
  <ViewPort
    :stories="stories"
    :story-selected="storySelected"
    :story-service="storyService"
    :state-service="stateService"
    :current-state="currentState"
    :show-pause-overview="showPauseOverview"
    @restartSession="restartSession"
    @resetSelectedStory="resetSelectedStory"
  />
  <mqtt @selectStory="setSelectStory" />
</template>
<script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  import ViewPort from '@/components/ViewPort.vue';
  import { useQuery } from '@vue/apollo-composable';
  import mqtt from '@/components/mqtt.vue';
  import StoryService from '@/services/StoryService';
  import StateService, { FlowState } from '@/services/StateService';
  import { SensorObject } from '@/composables/common';
  import { GetActiveBoxDocument, RelationType } from 'coghent-vue-3-component-library';
  import { useBoxVisiter } from 'coghent-vue-3-component-library';
  import { apolloClient } from '@/main';
  import { Relation } from 'coghent-vue-3-component-library/lib/queries';
  import { getFirstStoryToSee, getUnseenStories } from '@/composables/useBox';

  export default defineComponent({
    name: 'Wall',
    components: { ViewPort, mqtt },

    setup() {
      const stateService = new StateService(FlowState.welcome);
      let stories = ref<Array<any>>();
      const storySelected = ref<string>(
        JSON.stringify({ topic: 'sensors/1/present', id: 1, msg: true } as SensorObject),
      );
      const storyService = ref<StoryService | null>();
      const visitercode = ref<string | null>(null);
      const visiter = ref<any | null>(null);
      const inputValue = ref<string>('');
      const currentState = ref<string>(FlowState[0]);
      const showPauseOverview = ref<boolean>(false);
      const canScanTicket = ref<boolean>(false);
      const { getByCode, getRelationsByType } = useBoxVisiter(apolloClient);

      const { onResult, fetchMore } = useQuery(
        GetActiveBoxDocument,
        {},
        { fetchPolicy: 'cache-first' },
      );

      onResult((_stories) => {
        stories.value = _stories.data.ActiveBox.results;
        console.log('stories', stories.value);
        canScanTicket.value = true;
      });

      watch(visitercode, async (value) => {
        console.log('visitercode value', value);
        console.log('can scan ticket', canScanTicket.value);
        if (canScanTicket.value) {
          const storyRelations = (await useBoxVisiter(apolloClient).getRelationsByType(
            visitercode.value,
            RelationType.Stories,
          )) as Array<Relation>;
          ('71619587');
          const tmpStoryService = createTempStoryService(storyRelations);

          const storiesToSee = getUnseenStories(
            storyRelations.map((_relation) =>
              tmpStoryService.getStoryDataOfStory(_relation.key.replace('entities/', '')),
            ),
          );
          if (storiesToSee.length != 0) {
            const storyToSet = getFirstStoryToSee(storiesToSee);
            if (storyToSet) {
              tmpStoryService.setActiveStory(storyToSet.storyId);
              storyService.value = tmpStoryService;
            }
          } else {
            console.log('no stories to see going to overview');
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
              stateService.changeState(FlowState.storyOverview);
              tmpStoryService.setActiveStory(storyToSetActive);
              showPauseOverview.value = true;
              storyService.value = tmpStoryService;
            }
          }
          canScanTicket.value = false;
        }
      });

      const createTempStoryService = (_storyRelations: Array<Relation>) => {
        const tmpStoryService = new StoryService(
          stories.value as Array<any>,
          visiter.value,
        );
        tmpStoryService.fillUpDataSources();
        tmpStoryService.mergeVisiterStoryRelationsWithStoryData(_storyRelations);
        return tmpStoryService;
      };

      const restartSession = async (start: boolean) => {
        canScanTicket.value = start;
      };

      watch(inputValue, (value: string) => {
        if (canScanTicket.value && value.length === 8) {
          getCode(value);
          inputValue.value = '';
        }
      });

      const getCode = async (code: string) => {
        if (
          stateService.getCurrentState() != FlowState[1] &&
          stateService.getCurrentState() != FlowState[2] &&
          stateService.getCurrentState() != FlowState[3] &&
          stateService.getCurrentState() != FlowState[4] &&
          stateService.getCurrentState() != FlowState[6]
        ) {
          canScanTicket.value = true;
          currentState.value = stateService.getCurrentState();
          storyService.value = null;
          const visiterByCode = await useBoxVisiter(apolloClient).getByCode(String(code));
          visitercode.value = null;
          console.log('visiter', visiter);
          if (visiterByCode != null) {
            visitercode.value = String(code);
            visiter.value = visiterByCode;
            console.log('code set');
          }
        } else {
          stateService.changeState(FlowState.storyOverview);
          currentState.value = stateService.getCurrentState();
        }
      };

      const resetSelectedStory = (_resetTo: SensorObject) =>
        (storySelected.value = JSON.stringify(_resetTo));

      window.onkeydown = async (key: KeyboardEvent) => {
        switch (key.code) {
          case 'Digit1' || '97':
            console.log('pressed 1');
            storySelected.value = JSON.stringify({
              topic: 'sensors/1/present',
              id: 1,
              msg: true,
            } as SensorObject);
            break;
          case 'Digit2' || '98':
            console.log('pressed 2');
            storySelected.value = JSON.stringify({
              topic: 'sensors/2/present',
              id: 2,
              msg: true,
            } as SensorObject);
            break;
          case 'Digit3' || '99':
            console.log('pressed 3');
            storySelected.value = JSON.stringify({
              topic: 'sensors/3/present',
              id: 3,
              msg: true,
            } as SensorObject);
            break;
          case 'Digit4' || '100':
            console.log('pressed 4');
            storySelected.value = JSON.stringify({
              topic: 'sensors/4/present',
              id: 4,
              msg: true,
            } as SensorObject);
            break;
          case 'Digit5' || '101':
            console.log('pressed 5');
            break;
        }
      };

      const setSelectStory = (sensorValue: {
        topic: string;
        id: number;
        msg: boolean;
      }) => {
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
        showPauseOverview,
        stateService,
        currentState,
      };
    },
  });
</script>
