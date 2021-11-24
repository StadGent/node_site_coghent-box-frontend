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
      const circle = StoryCircle().Create(
        'Opkomst van de\n cinema',
        CircleHelper().CreateSchema(new Vector3(0, 0, 0), 2, storyColor),
        [currentFrame - 1, 5],
        'https://cdn-icons-png.flaticon.com/512/844/844994.png',
        true,
      );
      threeSvc.AddGroupsToScene(circle);

      const active = CircularProgressBar().createActiveSegment(
        new Vector3(0, 0, 0),
        2.5,
        3,
        currentFrame - 1,
        storyColor,
      );
      threeSvc.AddGroupsToScene(active.object);
      const activeFrameLine = StoryCircleItems().CreateDashedLineWithWord(
        DefaultLines().line3(active.dotSchemas[currentFrame - 1].position),
        useStory().setFrameTitles(activeStoryData)[currentFrame - 1],
      );
      threeSvc.AddToScene(activeFrameLine.object);
      const progressOfFrame = StoryCircle().progressText(
        [1, 5],
        new Vector3(
          activeFrameLine.endOfLine.x,
          activeFrameLine.endOfLine.y + 0.8,
          Layers.presentation,
        ),
        Colors().white,
      );
      threeSvc.AddToScene(progressOfFrame);
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
      const overviewFrame = FrameOverview().create(assets);
      frameAssetSchemas = overviewFrame.schemas;
      threeSvc.AddGroupsToScene(overviewFrame.groups);
    };

    const showAsset = (asset: Asset, position: Vector3) => {
      threeSvc.ClearScene();
      // threeSvc.AddToScene(Tools().Grid());

      const image = FrameOverview().addImage(asset, position);

      threeSvc.AddToScene(image);

      // setTimeout(() => {
      //   useAsset().zoom(image as Mesh<BoxBufferGeometry, any>, threeSvc.state.height);
      //   useAsset().setInactive(image2 as Mesh<BoxBufferGeometry, any>);
      //   threeSvc.AddToScene(useAsset().addMetadataToZoomedImage(asset,image as Mesh<BoxBufferGeometry, any>,storyColor));
      // }, 1000);
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
      threeSvc.ClearScene();
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

      playBook.addToPlayBook(() => threeSvc.AddToScene(group));
      // threeSvc.AddToScene(group)
      // useAsset().zoom(group.children[2] as Mesh<BoxBufferGeometry, any>, threeSvc.state.height)
      let highlightedImage: any;
      playBook.addToPlayBook(() =>
       { useAsset().zoom(
          group.children[2] as Mesh<BoxBufferGeometry, any>,
          threeSvc.state.height,
        );
        highlightedImage = useAsset().addMetadataToZoomedImage(
        assetsFromFrame[2],
        group.children[2] as Mesh<BoxBufferGeometry, any>,
        storyColor,
      );
        threeSvc.AddToScene(highlightedImage)}
      );
      // threeSvc.AddToScene(highlightedImage);
      // playBook.addToPlayBook(() => threeSvc.state.scene.remove(highlightedImage));
      
      playBook.addToPlayBook(() => {
        console.log('highlightedImage', highlightedImage);
        threeSvc.state.scene.remove(highlightedImage);
        group.children[2].scale.set(1, 1, 1);
        group.children[2].position.set(positions[2].x, positions[2].y, positions[2].z);
      });
      // group.children[2].scale.set(1,1,1);
      // group.children[2].position.set(positions[2].x,positions[2].y, positions[2].z);

      // group.children.forEach((asset, index) => {
      //   playBook.addToPlayBook(() =>
      //     {useAsset().zoom(asset as Mesh<BoxBufferGeometry, any>, threeSvc.state.height),
      //     threeSvc.AddToScene(useAsset().addMetadataToZoomedImage(assetsFromFrame[index],asset as Mesh<BoxBufferGeometry, any>,storyColor));}

      //   );

      //   playBook.addToPlayBook(() => {
      //     asset.scale.set(1, 1, 1);
      //   });
      // });

      console.log(group.children[1]);
      // useAsset().zoom(group.children[1] as Mesh<BoxBufferGeometry, any>, 600);
      // useAsset().setInactive(group.children[0] as Mesh<BoxBufferGeometry, any>);
      // showAsset(assetsFromFrame[0],new Vector3(0,0,0));
      // showAsset(assetsFromFrame[1],new Vector3(5,2,0));
      // playBook.addToPlayBook(() =>
      //   addFrameOverviewToScene(
      //     threeSvc,
      //     useStory().setFrameAssets(activeStoryData, currentFrame - 1),
      //   ),
      // );
      // playBook.addToPlayBook(() =>
      //   threeSvc.AddGroupsToScene(
      //     HorizontalProgressBar().create(
      //       new Vector3(0, -7, Layers.scene),
      //       [1000, 2000, 3000],
      //       5000,
      //       2500,
      //       storyColor,
      //     ),
      //   ),
      // );
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
      buildFrameAssetOverview(0);
      // buildFrameAssetOverview(2)1
      // buildFrameAssetOverview(3)
    };

    const startStory = () => {
      let current = 0;
      let time = 2;
      setInterval(() => {
        console.log(Math.floor(audioSchema.audio.context.currentTime));
        if (audioHelper.DoEvent(audioSchema.audio.context.currentTime, time)) {
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

        // buildFrameAssetOverview(currentFrame - 1);
        // showAsset();
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