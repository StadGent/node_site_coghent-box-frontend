<template>
  <div class="black"></div>
  <label
    class="absolute left-0 top-0 z-50"
    :class="[showInputField ? '' : ' opacity-0']"
    :v-if="visitercode == null"
    for=""
  >
    <input
      ref="qrInput"
      v-model="inputValue"
      class="z-50 relative"
      :class="[showInputField ? '' : ' opacity-0']"
      type="text"
      autofocus
    />
  </label>
  <ViewPort
    :stories="stories"
    :story-selected="storySelected"
    :story-service="storyService"
    :state-service="stateService"
    :current-state="currentState"
    :show-pause-overview="showPauseOverview"
    @resetSelectedStory="resetSelectedStory"
  />
  <mqtt @selectStory="setSelectStory" @mqttEnabled="toggleShowInputField" />
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import ViewPort from '@/components/ViewPort.vue';
import { useQuery } from '@vue/apollo-composable';
import mqtt from '@/components/mqtt.vue';
import StoryService from '@/services/StoryService';
import { FlowState } from '@/services/StateService';
import Common, { SensorObject } from '@/composables/common';
import useCustomStory from '@/composables/useCustomStory';
import useFlow, { FlowStage } from '@/composables/flows';
import { GetActiveBoxDocument, RelationType } from 'coghent-vue-3-component-library';
import { useBoxVisiter } from 'coghent-vue-3-component-library';
import { apolloClient } from '@/main';
import { Relation } from 'coghent-vue-3-component-library/lib/queries';
import { getFirstStoryToSee, getUnseenStories } from '@/composables/useBox';
import Defaults from '@/Three/defaults.config';
import stateService from '@/services/StateService';
import Videos from '@/Three/defaults.videos';
import VideoHelper from '@/Three/helper.video';
import { Vector3 } from 'three';
import globals from '@/services/GlobalData';
import { useStorybox } from 'coghent-vue-3-component-library';
import { Entity } from 'coghent-vue-3-component-library';

export default defineComponent({
  name: 'Wall',
  components: { ViewPort, mqtt },
  setup() {
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
    const isCustomStory = ref<boolean>(false);
    const { getByCode, getRelationsByType } = useBoxVisiter(apolloClient);
    const qrInput = ref<any>(null);
    window.addEventListener('focus', () => {
      if (qrInput.value) qrInput.value.focus();
    });

    const { onResult, fetchMore } = useQuery(
      GetActiveBoxDocument,
      {},
      { fetchPolicy: 'cache-first' },
    );

    const showInputField = ref<boolean>(false);

    const toggleShowInputField = (_mqttEnabled: boolean) => {
      showInputField.value = !_mqttEnabled;
    };

    onResult((_stories) => {
      stories.value = _stories.data.ActiveBox.results;
      console.log('stories', stories.value);
      stateService.canScanTicket = true;
    });

    const setVisiterData = async () => {
      showPauseOverview.value = false;
      if (stateService.canScanTicket) {
        const storyRelations = (await useBoxVisiter(apolloClient).getRelationsByType(
          visitercode.value,
          RelationType.Stories,
        )) as Array<Relation>;
        const tmpStoryService = createTempStoryService(storyRelations);
        const storiesToSee = getUnseenStories(
          storyRelations.map((_relation) =>
            tmpStoryService.getStoryDataOfStory(_relation.key.replace('entities/', '')),
          ),
        );
        tmpStoryService.hasScannedCode = tmpStoryService.hasAlreadyScannedCode();
        if (storiesToSee.length != 0) {
          stateService.canScanTicket = false;
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
            } else {
              stateService.canScanTicket = true;
            }
          });
          if (storyToSetActive) {
            stateService.changeState(FlowState.storyOverview);
            tmpStoryService.setActiveStory(storyToSetActive);
            showPauseOverview.value = true;
            storyService.value = tmpStoryService;
          }
        }
      }
      stateService.allStateStatus();
    };

    const setCustomStoryData = async (_visiterByCode: any, _storyId: string) => {
      const storydata = await useStorybox(apolloClient).getStoryData(_storyId);
      const tmpStoryService = new StoryService([storydata] as Array<any>, visiter.value);
      tmpStoryService.fillUpDataSources();
      tmpStoryService.setActiveStory(_storyId);
      tmpStoryService.hasScannedCode = true;
      storyService.value = tmpStoryService;
    };

    const createTempStoryService = (_storyRelations: Array<Relation>) => {
      const tmpStoryService = new StoryService(
        stories.value as Array<any>,
        visiter.value,
      );
      tmpStoryService.fillUpDataSources();
      tmpStoryService.mergeVisiterStoryRelationsWithStoryData(_storyRelations);
      return tmpStoryService;
    };

    watch(inputValue, (value: string) => {
      let code = Common().getCodeFromString(value);
      console.log('Code from inputfield', code);
      if (showInputField.value && value.length === 8) {
        code = value;
      }
      if (stateService.canScanTicket && code && code.length === 8) {
        console.log('code:', code);
        getCode(code);
        inputValue.value = '';
      }
      // inputValue.value = '';
    });

    const getCode = async (code: string) => {
      if (
        stories.value != null &&
        stateService.getCurrentState() != FlowState[1] &&
        stateService.getCurrentState() != FlowState[2] &&
        stateService.getCurrentState() != FlowState[3] &&
        stateService.getCurrentState() != FlowState[4] &&
        stateService.canScanTicket === true
      ) {
        console.log('Getting visiter with code:', code);
        currentState.value = stateService.getCurrentState();
        storyService.value = null;
        const visiterByCode = await useBoxVisiter(apolloClient).getByCode(String(code));
        if (visiterByCode.code) {
          visiter.value = visiterByCode;
          visitercode.value = String(code);
          const customStory = useCustomStory(stories.value, visiterByCode);
          isCustomStory.value = await customStory.isCustom();
          const customStoryId = await customStory.getStoryId();
          console.log(`FLOWS | current`, useFlow().current());
          console.log(`FLOWS | current flow stages`, useFlow().currentFlowStages());
          console.log(`FLOWS | current showAction`, useFlow().showAction(FlowStage.MENU));
          console.log(`isCustomStory`, isCustomStory);
          isCustomStory.value === true
            ? await setCustomStoryData(visiterByCode, customStoryId)
            : await setVisiterData();
        }
      } else {
        stateService.changeState(FlowState.storyOverview);
        currentState.value = stateService.getCurrentState();
      }
    };

    const resetSelectedStory = (_resetTo: SensorObject) =>
      (storySelected.value = JSON.stringify(_resetTo));

    window.onkeydown = async (key: KeyboardEvent) => {
      if (
        Defaults().keyboardSelect() ||
        (showInputField.value && stateService.canChooseNextStory)
      ) {
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
            storySelected.value = JSON.stringify({
              topic: 'sensors/1/instant',
              id: 1,
              msg: true,
            } as SensorObject);
            break;
          case 'Digit6' || '102':
            console.log('pressed 6');
            storySelected.value = JSON.stringify({
              topic: 'sensors/2/instant',
              id: 2,
              msg: true,
            } as SensorObject);
            break;
          case 'Digit7' || '103':
            console.log('pressed 7');
            storySelected.value = JSON.stringify({
              topic: 'sensors/3/instant',
              id: 3,
              msg: true,
            } as SensorObject);
            break;
          case 'Digit8' || '104':
            console.log('pressed 8');
            storySelected.value = JSON.stringify({
              topic: 'sensors/4/instant',
              id: 4,
              msg: true,
            } as SensorObject);
            break;
        }
      }
    };

    const setSelectStory = (sensorValue: { topic: string; id: number; msg: boolean }) => {
      console.log(`MQTT data => `, sensorValue);
      // if (sensorValue.topic.includes('present') && sensorValue.msg) {
      let selected = null;
      switch (Number(sensorValue.id)) {
        case 1:
          selected = 4;
          break;
        case 2:
          selected = 2;
          break;
        case 3:
          //center
          selected = 0;
          break;
        case 4:
          selected = 1;
          break;
        case 5:
          selected = 3;
          break;
      }
      if (selected && stateService.canChooseNextStory) {
        storySelected.value = JSON.stringify({
          topic: sensorValue.topic,
          id: selected,
          msg: sensorValue.msg,
        } as SensorObject);
      }

      console.log(`sensorvalue data => `, selected);
      // }
      //5-4-3-2-1
    };

    onMounted(() => {
      globals.startVideoElement = VideoHelper().videoElementAsCube(
        Videos.startVideoId,
        Videos.startOfSession,
        new Vector3(1920, 1080, 0),
        new Vector3(0, 0, 0),
      );
      globals.menuVideoElement = VideoHelper().videoElementAsCube(
        Videos.menuVideoId,
        Videos.menu,
        new Vector3(1080, 1080, 0),
        new Vector3(0, -90, 0),
      );
      globals.menuVideoElement.scale.set(0.4, 0.4, 1);
    });

    return {
      qrInput,
      stories,
      storySelected,
      setSelectStory,
      storyService,
      resetSelectedStory,
      inputValue,
      showPauseOverview,
      stateService,
      currentState,
      toggleShowInputField,
      showInputField,
    };
  },
});
</script>

<style scoped>
.black {
  position: fixed;
  top: 0;
  left: 0;
  background-color: black;
  height: 100vh;
  width: 100vw;
  z-index: -11;
}
</style>
