<template>
  <div ref="viewport"></div>
  <button @click="pause = !pause">pause</button><br />
  <button @click="PlayAudio">play audio</button><br />
  <button @click="PauseAudio">pause audio</button><br />
</template>

<script lang="ts">
import usePredefined, { StoryType } from '@/Three/usePredefined';
import useStory from '@/composables/useStory';
import Frame from '@/composables/frame';
import Tools from '@/Three/Tools';
import TestData from '@/Three/TestData';
import ThreeService from '@/services/ThreeService';
import { defineComponent, onMounted, PropType, reactive, ref, watch } from 'vue';
import { BufferGeometry, Color, Material, Mesh, Vector3 } from 'three';
import DefaultColors from '@/Three/defaults.color';
import { Entity } from 'coghent-vue-3-component-library/lib/queries';
import { Entity as _Entity, Story } from '@/models/GraphqlModel';
import CubeHelper from '@/Three/CubeHelper';
import Common from '@/composables/common';
import FrameOverview from '@/screens/FrameOverview';
import { CubeSchema } from '@/Three/CubeSchema';
import AudioSchema from '@/Three/AudioSchema';
import Spot from '@/Three/Spotlight';
import AudioHelper from '@/Three/AudioHelper';
import StoryPaused from '@/screens/StoryPaused';


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
    const currentFrame = 1;
    const pause = ref(false);
    const viewport = ref(null);
    let threeSvc: ThreeService;
    let audioSchema: any;
    let audioHelper: any;
    let toRemove: Mesh<BufferGeometry, Material | Material[]>[] = [];
    let storyData = reactive<Array<Story>>([]);

    const spotlight = () => {
      const spot = Spot();
      spot.create(new Vector3(-5,1,0))
      threeSvc.AddToScene(spot.SpotLight());
      threeSvc.AddToScene(Spot().block(new Vector3(0,1,0),5));
      setTimeout(() => {
        spot.move(new Vector3(0,1,0),5)
      threeSvc.AddToScene(spot.SpotLight());
      }, 1000);
      
    }

    const addBaseStoryToScene = (threeSvc: ThreeService) => {
      threeSvc.state.scene.background = new Color(DefaultColors().black);
      threeSvc.ClearScene();

      // const storyOverview = usePredefined().BaseStoryCircle(story, false);
      // console.log('Storyoverview', storyOverview);
      // threeSvc.AddGroupsToScene(storyOverview.storyOverview);
      // threeSvc.AddToScene(
      //   CubeHelper().HighlightImage(story.frameSchemas?.[0] as CubeSchema),
      // );
      // threeSvc.AddToScene(Tools().Grid());
      threeSvc.state.scene.updateMatrixWorld(true);
    };

    const showPauseScreen = (threeSvc: ThreeService) => {
      threeSvc.ClearScene();
      // threeSvc.AddToScene(Tools().Grid());
      // threeSvc.AddGroupsToScene(
      //   usePredefined().PausedStories(
      //     Common().RemoveEntersFromString(story.title),
      //     Story().GetStoryTitles(stories.value),
      //   ),
      // );
    };

    const addFrameOverviewToScene = async (threeSvc: ThreeService, frame: Entity) => {
      threeSvc.ClearScene();
      const overviewFrame = await FrameOverview(frame).Create();
      threeSvc.AddGroupsToScene(overviewFrame.groups);
      // story.HighlightAssetSchemas = overviewFrame.schemas;
      // hightlightFrameAsset(overviewFrame.schemas[0]);
    };
    const PlayAudio = () => {
      audioHelper.Play();
    };
    const PauseAudio = () => {
      audioHelper.Pause();
      console.log('PAUSE');

      console.log('CURRENTIME', audioSchema.audio.context.currentTime);
    };

    const buildStory = () => {
      console.log('buildStory()', storyData);
      const activeStory = useStory().setActiveStory(storyData, currentStory-1);
      const activeStoryTitle = useStory().title(activeStory);
      const frameTitles = useStory().setFrameTitles(activeStory);
      const frameAssets = useStory().setFrameAssets(activeStory, currentFrame-1);
      console.log('const activeStory = ', activeStory);    
      console.log('const activeStoryTitle = ', activeStoryTitle);
      console.log('const frameTitles = ', frameTitles);
      console.log('const frameAssets = ', frameAssets);
            
      // story.frameSchemas = usePredefined().BaseStoryCircle(story, false)
      //   .schemas as Array<CubeSchema>;

    };

    const hightlightFrameAsset = async (schema: CubeSchema) => {
      toRemove.forEach((obj) => threeSvc.state.scene.remove(obj));
      const highlight = CubeHelper().HighlightImage(schema);
      threeSvc.AddToScene(highlight);
      toRemove.push(highlight);

    };

    const startStory = () => {
      const funcs = [
        // async () =>
        //   await addFrameOverviewToScene(threeSvc, storyService.activeFrame as Entity),
        // async () =>
        //   await hightlightFrameAsset(story.HighlightAssetSchemas?.[0] as CubeSchema),
        // async () =>
        //   await hightlightFrameAsset(story.HighlightAssetSchemas?.[1] as CubeSchema),
        // // async () =>  CubeHelper().ScaleBoxImage(toRemove[0], new Vector3(4,4,0)),
        // async () =>
        //   await hightlightFrameAsset(story.HighlightAssetSchemas?.[2] as CubeSchema),
        // async () =>
        //   await hightlightFrameAsset(story.HighlightAssetSchemas?.[3] as CubeSchema),
        // async () =>
        //   await hightlightFrameAsset(story.HighlightAssetSchemas?.[4] as CubeSchema),
        // async () =>
        //   await hightlightFrameAsset(story.HighlightAssetSchemas?.[5] as CubeSchema),
      ];
      audioHelper.Play();
      let current = 0;
      let time = 3;
      setInterval(() => {
        console.log(Math.floor(audioSchema.audio.context.currentTime));
        if (
          audioHelper.DoEvent(Math.floor(audioSchema.audio.context.currentTime), time)
        ) {
          // funcs[current]();
          time += 4;
          current++;
        }
      }, 1000);
    };

    onMounted( () => {
      threeSvc = new ThreeService(viewport);
      audioSchema = AudioSchema(threeSvc);
      audioSchema.loadAudioFile('/Audio/example.mp3');
      audioHelper = AudioHelper(audioSchema);
      if (stories.value) {
        storyData = stories.value;
        console.log('=> ACTIVE STORIES <=', stories)
        buildStory();
        // startStory();
        // addBaseStoryToScene(threeSvc);
        // await addFrameOverviewToScene(threeSvc, storyService.activeFrame as Entity);
      }
      threeSvc.Animate();
    });

    return { viewport, pause, PlayAudio, PauseAudio };
  },
});
</script>