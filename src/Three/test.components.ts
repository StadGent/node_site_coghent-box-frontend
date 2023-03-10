import Common from '@/composables/common';
import { StoryData } from '@/services/StoryService';
import { Tags } from '@/services/TaggingService';
import ThreeService from '@/services/ThreeService';
import { Entity } from 'coghent-vue-3-component-library/lib';
import { BoxGeometry, BufferGeometry, CircleGeometry, Group, Material, MathUtils, Mesh, MeshBasicMaterial, MeshNormalMaterial, RingGeometry, Vector3 } from 'three';
import Colors from './defaults.color';
import HelperText from './defaults.helperText';
import Measurements from './defaults.measurements';
import GroupHelper from './helper.group';
import TextHelper from './helper.text';
import { CircleParams, CircleSchema } from './schema.circle';
import SchemaCube, { CubeParams, CubeSchema } from './schema.cube';
import { FontParams } from './schema.text';
import CircularProgressBar from './shapes.circularProgressbar';
import HorizontalProgressBar from './shapes.horizontalProgressBar';
import MetadataLabel from './shapes.metadataLabel';
import PauseProgressbar, { PauseProgressbarObjects } from './shapes.pauseProgressbar';

const TestSingleComponent = (): {
  testCube: (_position: Vector3, _dimensions: Vector3) => Mesh<BoxGeometry, MeshBasicMaterial>;
  testImageCube: (_position: Vector3) => Mesh<BoxGeometry, MeshBasicMaterial>;
  testText: (_position: Vector3) => Promise<Mesh<BufferGeometry, any>>;
  horizontalProgressbar: Array<Group>;
  circularProgressbar: Mesh<BufferGeometry, Material | Material[]>;
  circularProgressbarActiveSegments: (position: Vector3) => {
    object: Group[];
    dotSchemas: CircleSchema[];
  };
  endOfStoryText: (position: Vector3) => Promise<Group>;
  metadataLabel: (position: Vector3, text: string) => Group;
  metadataLabelWithConnection: (position: Vector3, text: string) => Array<Group>;
  pauseStoryCircleProgress: (_position: Vector3) => Promise<PauseProgressbarObjects>;
  countdownCircle: (_position: Vector3, _progress: number, _color?: number) => Mesh<RingGeometry, MeshBasicMaterial>;
  spotlight: (_position: Vector3) => Mesh<CircleGeometry, MeshBasicMaterial>;
  frameOverview: (_threeService: ThreeService, _stories: Array<Entity>, _story: string, _frame: string) => void
} => {

  const testCube = (_position: Vector3, _dimensions: Vector3) => {
    return SchemaCube().CreateCube({ position: _position, params: { color: Colors().green, width: _dimensions.x, height: _dimensions.y, opacity: 1 } as CubeParams } as CubeSchema);
  };
  const testImageCube = (_position: Vector3) => {
    return SchemaCube().CreateImageCube({ position: _position, params: { url: 'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2370&q=80', color: Colors().green, width: 5700, height: 1000, opacity: 1 } as CubeParams } as CubeSchema);
  };

  const testText = async (_position: Vector3) => {
    return await TextHelper().CreateText(
      '3',
      _position,
      {
        color: Colors().white,
        width: 0,
      } as CubeParams,
      { size: Measurements().text.size.small } as FontParams,
    );
  };

  const horizontalProgressbar = HorizontalProgressBar().create(new Vector3(0, -7, 1), [0, 3, 6], 8, 0.1, Colors().yellow);

  const circularProgressbar = CircularProgressBar().create(new Vector3(0, 0, 0), Measurements().storyCircle.radius, 3, 1, Colors().yellow);

  const circularProgressbarActiveSegments = (position: Vector3) => CircularProgressBar().createActiveSegment(position, Measurements().storyCircle.radius, 3, 3, Colors().yellow);

  const endOfStoryText = async (position: Vector3) => {
    const text = await TextHelper().CreateTextFromRecord(
      HelperText().EndOfStory(position),
      Colors().black,
    );
    return GroupHelper().CreateGroup(text);
  };

  const metadataLabel = (position: Vector3, text: string) => {
    // return MetadataLabel(position).create(text, Colors().green).metadata;
    return '' as any
  };

  const metadataLabelWithConnection = (position: Vector3, text: string) => {
    const groups: Array<Group> = [];
    // GroupHelper().AddObjectsTogroups([MetadataLabel(position).create(text, Colors().green).metadata, MetadataLabel(position).create(text, Colors().green).connection], groups)
    return groups;
  };

  const pauseStoryCircleProgress = async (_position: Vector3) => {
    const storyData = {
      storyId: '',
      totalOfFrames: 6,
      seenFrames: {},
      totalOfFramesSeen: 1,
      storySeen: false,
      storyColor: Colors().green,
      pausedPosition: new Vector3(0, 0, 0),
    }
    const schema = {
      position: _position,
      params: { radius: Measurements().storyCircle.progressRadius - Measurements().progressBar.thickness / 2, color: Colors().green } as CircleParams,
    } as CircleSchema;
    return await PauseProgressbar(storyData).create(schema);
  };

  const countdownCircle = (_position: Vector3, _progress: number, _color?: number) => {
    const radius = Measurements().startOfSession.countdownCircleRadius
    const geometry = new RingGeometry(
      radius,
      radius + Measurements().progressBar.thickness,
      360 / 1, 45, 6.3 / 360 - (6.3 / 360 / 1) * _progress,
      (6.3 / 360 / 1) * _progress * 360);
    const material = new MeshBasicMaterial({
      color: _color || Colors().progressGrey,
      opacity: Measurements().progressBar.opacity,
      transparent: true,
    });
    material.color.convertSRGBToLinear();
    const _ring = new Mesh(geometry, material);
    _ring.rotateZ(MathUtils.degToRad(90));
    Common().setPosition(_ring, _position);
    return _ring;
  };

  const spotlight = (_position: Vector3) => {
    const geometry = new CircleGeometry(3, 50);
    const material = new MeshBasicMaterial({ color: Colors().progressGrey, opacity: 0.4, transparent: true });
    material.color.convertSRGBToLinear();
    material.clipIntersection = true;
    const mesh = new Mesh(geometry, material);
    Common().setPosition(mesh, _position)
    return mesh;
  }

  const frameOverview = (_threeService: ThreeService, _stories: Array<Entity>, _story: string, _frame: string) => {
    const cube = testCube(new Vector3(0, 0, 0), new Vector3(1, 1, 0))
    console.log({ _stories })
    _stories.forEach((story) => {
      if (story.id === _story) {
        console.log('Found story', story)
        if (story.frames && story.frames.length >= 0) {
          console.log('has frames')
          story.frames?.forEach(frame => {
            if (frame?.id === _frame) {
              frame?.relationMetadata?.forEach(data => {
                const newCube = cube.clone()
                if (data && data?.position) {
                  const assetResults = story.assets?.filter(asset => asset?._key?.replace('entities/', '') === data.key)
                  console.log({ assetResults })
                  if (assetResults && assetResults[0]) {
                    newCube.position.set(data?.position?.x as number, data?.position?.y as number, data?.position.z as number)
                    cube.geometry.parameters.width = Number(assetResults[0].primary_width)
                    cube.geometry.parameters.height = Number(assetResults[0].primary_height)
                    console.log('ADDING CUBE')
                    Common().setScale(cube, data.scale ? data.scale : 1)
                    _threeService.AddToScene(cube, Tags.Testing)
                  }
                }
              })
            }
          })
        }

      }
    })
  }

  return {
    testCube,
    testImageCube,
    testText,
    horizontalProgressbar,
    circularProgressbar,
    circularProgressbarActiveSegments,
    endOfStoryText,
    metadataLabel,
    metadataLabelWithConnection,
    pauseStoryCircleProgress,
    countdownCircle,
    spotlight,
    frameOverview
  }
};

export default TestSingleComponent