<template>
  <div ref="viewport"></div>
  <button @click="pause = !pause">pause</button><br />
  <button @click="PlayAudio">play audio</button><br />
  <button @click="PauseAudio">pause audio</button><br />
</template>

<script lang="ts">
import useStory from '@/composables/useStory';
import Frame from '@/composables/frame';
import Tools from '@/Three/Tools';
import ThreeService from '@/services/ThreeService';
import { defineComponent, onMounted, PropType, reactive, ref } from 'vue';
import { BufferGeometry, Color, Material, Mesh, Vector3 } from 'three';
import { Entity } from 'coghent-vue-3-component-library/lib/queries';
import { Entity as _Entity, Story } from '@/models/GraphqlModel';
import FrameOverview from '@/screens/FrameOverview';
import { CubeSchema } from '@/Three/CubeSchema';
import AudioSchema from '@/Three/AudioSchema';
import Spot from '@/Three/Spotlight';
import AudioHelper from '@/Three/AudioHelper';
import StoryPaused from '@/screens/StoryPaused';
import Layers from '@/Three/defaults.layers';
import PlayBook from '@/composables/playbook';
import StoryCircle from '@/Three/SectionStoryCircle';
import CircleHelper from '@/Three/CircleHelper';
import CircularProgressBar from '@/Three/CircularProgressbar';
import Colors from '@/Three/defaults.color';
import StoryCircleItems from '@/Three/SectionStoryCircleItems';
import DefaultLines from '@/Three/LinesDefault';
import GroupHelper from '@/Three/GroupHelper';

export default defineComponent({
  name: 'ViewPort',
  props: {
    stories: {
      type: Array as PropType<Array<Story>>,
      required: true,
    },
  },
  setup(props) {

    const stories = ref(props.stories);
    const currentStory = 1;
    const currentFrame = 2;
    const pause = ref(false);
    const viewport = ref(null);
    let threeSvc: ThreeService;
    let audioSchema: any;
    let audioHelper: any;
    let storyData = reactive<Array<Story>>([]);
    let activeStoryData = reactive<Story>({} as Story);
    const spot = Spot();
    const playBook = PlayBook();
    let frameAssetSchemas: Array<CubeSchema> = [];

    const moveSpotlight = (position: Vector3, widestLength: number) => {
      spot.move(position, widestLength);
      threeSvc.AddToScene(spot.SpotLight());
    };

    const buildStoryCircle = (threeSvc: ThreeService) => {
      threeSvc.state.scene.background = new Color(Colors().black);
      threeSvc.ClearScene();
      const circle = StoryCircle().Create('Opkomst van de\n cinema',CircleHelper().CreateSchema(new Vector3(0,0,0),2,Colors().yellow), [currentFrame -1,5], 'https://cdn-icons-png.flaticon.com/512/844/844994.png', true);
      threeSvc.AddGroupsToScene(circle);

      const active = CircularProgressBar().createActiveSegment(new Vector3(0,0,0),2.5,3,currentFrame-1,Colors().pink);
      threeSvc.AddGroupsToScene(active.object);
      const activeFrameLine = StoryCircleItems().CreateDashedLineWithWord(DefaultLines().line3(active.dotSchemas[currentFrame -1].position),useStory().setFrameTitles(activeStoryData)[currentFrame -1]);
      threeSvc.AddToScene(activeFrameLine);

      // const updated = GroupHelper().CreateGroup(circle);
      // updated.position.set(-5,0,0);
      // updated.scale.set(.5,0.5,0);

      // threeSvc.AddGroupsToScene([updated]);
      // threeSvc.AddToScene(Tools().Grid());
      threeSvc.state.scene.updateMatrixWorld(true);
    };

    const showPauseScreen = (threeSvc: ThreeService) => {
      threeSvc.ClearScene();      
    };

    const addFrameOverviewToScene = (
      threeSvc: ThreeService,
      assets: Record<string, string>,
    ) => {
      threeSvc.ClearScene();
      const overviewFrame = FrameOverview().Create(assets);
      frameAssetSchemas = overviewFrame.schemas;
      threeSvc.AddGroupsToScene(overviewFrame.groups);
    };

    const PlayAudio = () => {
      audioHelper.Play();
    };
    const PauseAudio = () => {
      audioHelper.Pause();
      console.log('PAUSE');

      console.log('CURRENTIME', audioSchema.audio.context.currentTime);
    };

    const buildFrameAssetOverview = (currentFrame: number) => {
      playBook.addToPlayBook(() =>
        addFrameOverviewToScene(
          threeSvc,
          useStory().setFrameAssets(activeStoryData, currentFrame - 1),
        ),
      );

      playBook.addToPlayBook(() => moveSpotlight(frameAssetSchemas[0].position, 4));
      playBook.addToPlayBook(() => moveSpotlight(frameAssetSchemas[1].position, 4));
      playBook.addToPlayBook(() => moveSpotlight(frameAssetSchemas[2].position, 4));
      playBook.addToPlayBook(() => moveSpotlight(frameAssetSchemas[2].position, 4)); 
    };

    const buildStory = (currentStory: number) => {
      console.log('buildStory()', storyData);
      activeStoryData = useStory().setActiveStory(storyData, currentStory - 1);

      spot.create(new Vector3(0, 0, Layers.scene));
      buildStoryCircle(threeSvc);

      // buildFrameAssetOverview(1)
      // buildFrameAssetOverview(2)
      // buildFrameAssetOverview(3)
    }

    const startStory = () => {
      let current = 0;
      let time = 2;
      setInterval(() => {
        console.log(Math.floor(audioSchema.audio.context.currentTime));
        if (
          audioHelper.DoEvent(audioSchema.audio.context.currentTime, time)
        ) {
          playBook.getPlayBookFunctions()[current]();
          time += 1.5;
          current++;
        }
      }, 500);
    };

    onMounted(() => {
      threeSvc = new ThreeService(viewport);
      audioSchema = AudioSchema(threeSvc);
      // audioSchema.loadAudioFile('/Audio/example.mp3');
      audioHelper = AudioHelper(audioSchema);
      if (stories.value) {
        // PlayAudio();
        storyData = stories.value;
        console.log('=> ACTIVE STORIES <=', stories);
        buildStory(currentStory);
        // startStory();
        // const pos = spot.moveTo(new Vector3(-3,2,Layers.scene), new Vector3(3,-2,Layers.scene))
        // console.log(pos);
        // for (let index = 0; index < pos.length; index++) {
        //   moveSpotlight(pos[index], 4)
        // }

      }
      threeSvc.Animate();
    });

    return { viewport, pause, PlayAudio, PauseAudio };
  },
});
</script>