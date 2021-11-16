<template>
  <div ref="viewport"></div>
  <button @click="pause = !pause">pause</button><br />
  <button @click="PlayAudio">play audio</button><br />
  <button @click="PauseAudio">pause audio</button><br />
</template>

<script lang="ts">
import usePredefined, { StoryType } from '@/Three/usePredefined';
import Story from '@/composables/story';
import Frame from '@/composables/frame';
import Tools from '@/Three/Tools';
import TestData from '@/Three/TestData';
import ThreeService from '@/services/ThreeService';
import { defineComponent, onMounted, PropType, reactive, ref, watch } from 'vue';
import { BufferGeometry, Color, Material, Mesh, Vector3 } from 'three';
import DefaultColors from '@/Three/defaults.color';
import { Entity } from 'coghent-vue-3-component-library/lib/queries';
import CubeHelper from '@/Three/CubeHelper';
import Common from '@/composables/common';
import FrameOverview from '@/screens/FrameOverview';
import { CubeSchema } from '@/Three/CubeSchema';
import AudioSchema from '@/Three/AudioSchema';
import AudioHelper from '@/Three/AudioHelper';

export default defineComponent({
  name: 'ViewPort',
  props: {
    stories: {
      type: Array as PropType<Array<Entity>>,
      required: true,
    },
  },
  setup(props) {
    const stories = ref(props.stories);
    const currentStory = 1;
    const story = reactive<StoryType>({
      title: Story().Title(stories.value[currentStory - 1]),
    } as StoryType);
    const pause = ref(false);
    const viewport = ref(null);
    let threeSvc: ThreeService;
    let audioSchema: any;
    let audioHelper: any;
    let toRemove: Mesh<BufferGeometry, Material|Material[]>[] = [];

    const addBaseStoryToScene = (threeSvc: ThreeService) => {
      threeSvc.state.scene.background = new Color(DefaultColors().black);
      threeSvc.ClearScene();
      const storyOverview = usePredefined().BaseStoryCircle(story, false);
      threeSvc.AddGroupsToScene(storyOverview.storyOverview);
      threeSvc.AddToScene(
        CubeHelper().HighlightImage(story.frameSchemas?.[0] as CubeSchema),
      );
      // threeSvc.AddToScene(Tools().Grid());
      threeSvc.state.scene.updateMatrixWorld(true);
    };

    const showPauseScreen = (threeSvc: ThreeService) => {
      threeSvc.ClearScene();
      // threeSvc.AddToScene(Tools().Grid());
      threeSvc.AddGroupsToScene(
        usePredefined().PausedStories(
          Common().RemoveEntersFromString(story.title),
          Story().GetStoryTitles(stories.value),
        ),
      );
    };

    const addFrameOverviewToScene = async (threeSvc: ThreeService, frame: Entity) => {
      threeSvc.ClearScene();
      const overviewFrame = await FrameOverview(frame).Create();
      threeSvc.AddGroupsToScene(overviewFrame.groups);
      story.HighlightAssetSchemas = overviewFrame.schemas;
    };
    const PlayAudio = () => {
      audioHelper.Play();
    };
    const PauseAudio = () => {
      audioHelper.Pause();
    };

    const buildStory = async () => {
      const storyFramesIds = Story().RelationIds(stories.value[currentStory - 1]);
      const frames = await Frame().GetFrames(storyFramesIds);
      const assetsFromFrame = await Frame().GetAssetsFromFrame(frames[0].id);
      console.log('assets from frame 1', assetsFromFrame);
      const frameTitles = Frame().GetFrameTitles(frames);
      const centerWords = Story().CreateCenterWords(frameTitles);
      const frameRecord = Frame().CreateFrameRecord(frames);

      story.frames = frames;
      story.framesRecord = assetsFromFrame;
      story.centerWords = centerWords as Record<string, Vector3>;
      story.frameSchemas = usePredefined().BaseStoryCircle(story, false)
        .schemas as Array<CubeSchema>;
    };

    const hightlightFrameAsset = async (schema: CubeSchema) => {
      toRemove.forEach((obj) => threeSvc.state.scene.remove(obj))
      const highlight = CubeHelper().HighlightImage(schema);
      threeSvc.AddToScene(highlight);
      toRemove.push(highlight);
    };
    const startStory = () => {
      const funcs = [
        async () => await addFrameOverviewToScene(threeSvc, story.frames[1] as Entity),
        async () => await hightlightFrameAsset(story.HighlightAssetSchemas?.[0] as CubeSchema),
        async () => await hightlightFrameAsset(story.HighlightAssetSchemas?.[1] as CubeSchema),
        async () => await hightlightFrameAsset(story.HighlightAssetSchemas?.[2] as CubeSchema),
        async () => await hightlightFrameAsset(story.HighlightAssetSchemas?.[3] as CubeSchema),
      ];
      audioHelper.Play();
      let current = 0;
      let time = 3;
      setInterval(() => {
        console.log(Math.floor(audioSchema.audio.context.currentTime));
        if (
          audioHelper.DoEvent(Math.floor(audioSchema.audio.context.currentTime), time)
        ) {
          funcs[current]();
          time += 2;
          current++;
        }
      }, 1000);
    };

    onMounted(async () => {
      threeSvc = new ThreeService(viewport);
      audioSchema = AudioSchema(threeSvc);
      audioHelper = AudioHelper(audioSchema);
      audioSchema.loadAudioFile('/Audio/example.mp3');
      if (stories.value) {
        console.log('stories => ', stories.value);
        await buildStory();
        startStory();
        // addBaseStoryToScene(threeSvc);
        // await addFrameOverviewToScene(threeSvc, story.frames[1] as Entity);
      }
      threeSvc.Animate();
    });

    return { viewport, pause, PlayAudio, PauseAudio };
  },
});
</script>