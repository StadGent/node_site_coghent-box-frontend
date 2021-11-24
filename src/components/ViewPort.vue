<template>
  <div ref="viewport"></div>
  <button @click="pause = !pause">pause</button><br />
  <button @click="PlayAudio">play audio</button><br />
  <button @click="PauseAudio">pause audio</button><br />
</template>

<script lang="ts">
import useStory from '@/composables/useStory';
import Tools from '@/Three/Tools';
import ThreeService from '@/services/ThreeService';
import { defineComponent, onMounted, PropType, reactive, ref } from 'vue';
import { BoxBufferGeometry, Color, Group, Mesh, Vector3 } from 'three';
import { Asset, Entity as _Entity, Story } from '@/models/GraphqlModel';
import FrameOverview from '@/screens/FrameOverview';
import { CubeSchema } from '@/Three/CubeSchema';
import AudioSchema from '@/Three/AudioSchema';
import Spot from '@/Three/Spotlight';
import AudioHelper from '@/Three/AudioHelper';
import StoryPaused from '@/screens/StoryPaused';
import Layers from '@/Three/defaults.layers';
import PlayBook from '@/composables/playbook';
import useAsset from '@/composables/useAsset';
import StoryCircle from '@/Three/SectionStoryCircle';
import CircleHelper from '@/Three/CircleHelper';
import CircularProgressBar from '@/Three/CircularProgressbar';
import HorizontalProgressBar from '@/Three/HorizontalProgressBar';
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
    const storyColor = Colors().yellow;
    let currentFrame = 1;
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
      playBook.addToPlayBook(() => threeSvc.ClearScene());
      const circle = StoryCircle().Create(
        useStory().title(activeStoryData),
        CircleHelper().CreateSchema(new Vector3(0, 0, 0), 2, storyColor),
        [currentFrame, activeStoryData.frames.length],
        'https://cdn-icons-png.flaticon.com/512/844/844994.png',
        true,
      );
      const active = CircularProgressBar().createActiveSegment(
        new Vector3(0, 0, 0),
        2.5,
        3,
        currentFrame -1,
        storyColor,
      );
      const activeFrameLine = StoryCircleItems().CreateDashedLineWithWord(
        DefaultLines().line3(active.dotSchemas[currentFrame - 1].position),
        useStory().setFrameTitles(activeStoryData)[currentFrame - 1],
      );

      const progressOfFrame = StoryCircle().progressText(
        [currentFrame , activeStoryData.frames.length],
        new Vector3(
          activeFrameLine.endOfLine.x,
          activeFrameLine.endOfLine.y + 0.8,
          Layers.presentation,
        ),
        Colors().white,
      );

      playBook.addToPlayBook(() => {
        threeSvc.AddGroupsToScene(circle);
        threeSvc.AddGroupsToScene(active.object);
        threeSvc.AddToScene(activeFrameLine.object);
        threeSvc.AddToScene(progressOfFrame);
      });

      // threeSvc.AddToScene(Tools().Grid());
      threeSvc.state.scene.updateMatrixWorld(true);
    };

    const showPauseScreen = (threeSvc: ThreeService) => {
      threeSvc.ClearScene();
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
      const assetsFromFrame = useAsset().getAssetsFromFrame(
        activeStoryData,
        currentFrame,
      );
      const group: Group = new Group();
      const positions: Array<Vector3> = [];
      let pos = -8;
      for (const asset of assetsFromFrame) {
        const position = new Vector3(pos, 0, Layers.presentation);
        positions.push(position);
        group.add(FrameOverview().addImage(asset, position));
        pos += 6;
      }

      playBook.addToPlayBook(() => {
        threeSvc.ClearScene();
        threeSvc.AddToScene(group);
      });

      group.children.forEach((asset, index) => {
        let highlightedImage: any;
        playBook.addToPlayBook(() => {
          useAsset().zoom(asset as Mesh<BoxBufferGeometry, any>, threeSvc.state.height);
          highlightedImage = useAsset().addMetadataToZoomedImage(
            assetsFromFrame[index],
            asset as Mesh<BoxBufferGeometry, any>,
            storyColor,
          );
          threeSvc.AddToScene(highlightedImage);
        });

        playBook.addToPlayBook(() => {
          threeSvc.state.scene.remove(highlightedImage);
          asset.scale.set(1, 1, 1);
          asset.position.set(positions[index].x, positions[index].y, positions[index].z);
          threeSvc.AddGroupsToScene(
            HorizontalProgressBar().create(
              new Vector3(0, -7, Layers.scene),
              [1000, 2000, 3000],
              5000,
              currentFrame+1*1000,
              storyColor,
            ),
          )
        });
      });

      // playBook.addToPlayBook(() => moveSpotlight(frameAssetSchemas[0].position, 4));
      // playBook.addToPlayBook(() => moveSpotlight(frameAssetSchemas[1].position, 4));
      // playBook.addToPlayBook(() => moveSpotlight(frameAssetSchemas[2].position, 4));
      // playBook.addToPlayBook(() => moveSpotlight(frameAssetSchemas[2].position, 4));
    };
    const buildStory = (currentStory: number) => {
      console.log('buildStory()', storyData);
      activeStoryData = useStory().setActiveStory(storyData, currentStory - 1);

      spot.create(new Vector3(0, 0, Layers.scene));
      buildStoryCircle(threeSvc);
      buildFrameAssetOverview(currentFrame - 1);
      currentFrame++;
      buildStoryCircle(threeSvc);
      buildFrameAssetOverview(currentFrame - 1);
      currentFrame++;
      buildStoryCircle(threeSvc);
      buildFrameAssetOverview(currentFrame - 1);
    };
    const startStory = () => {
      let current = 0;
      let time = 2;
      setInterval(() => {
        console.log(Math.floor(audioSchema.audio.context.currentTime));
        if (audioHelper.DoEvent(audioSchema.audio.context.currentTime, time)) {
          playBook.getPlayBookFunctions()[current]();
          time += 1;
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
        // threeSvc.AddGroupsToScene(HorizontalProgressBar().create(new Vector3(0,-7,Layers.scene),[1000,2000,3000],5000,2500,storyColor));
        startStory();
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