import Common from '@/composables/common';
import { StoryData } from '@/services/StoryService';
import { BoxGeometry, BufferGeometry, Group, Material, MathUtils, Mesh, MeshBasicMaterial, RingGeometry, Vector3 } from 'three';
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
  testCube: (_position: Vector3) => Mesh<BoxGeometry, MeshBasicMaterial>;
  testText: (_position: Vector3) => Mesh<BufferGeometry, any>;
  horizontalProgressbar: Array<Group>;
  circularProgressbar: Mesh<BufferGeometry, Material | Material[]>;
  circularProgressbarActiveSegments: (position: Vector3) => {
    object: Group[];
    dotSchemas: CircleSchema[];
  };
  endOfStoryText: (position: Vector3) => Group;
  metadataLabel: (position: Vector3, text: string) => Group;
  metadataLabelWithConnection: (position: Vector3, text: string) => Array<Group>;
  pauseStoryCircleProgress: (_position: Vector3, _storyData: StoryData) => PauseProgressbarObjects;
  countdownCircle: (_position: Vector3, _progress: number, _color?: number) => Mesh<RingGeometry, MeshBasicMaterial>;
} => {

  const testCube = (_position: Vector3) => {
    return SchemaCube().CreateCube({ position: _position, params: { color: Colors().green, width: 1, height: 1, opacity: 0.6 } as CubeParams } as CubeSchema);
  };

  const testText = (_position: Vector3) => {
    return TextHelper().CreateText(
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

  const endOfStoryText = (position: Vector3) => {
    const text = TextHelper().CreateTextFromRecord(
      HelperText().EndOfStory(position),
      Colors().black,
    );
    return GroupHelper().CreateGroup(text);
  };

  const metadataLabel = (position: Vector3, text: string) => {
    return MetadataLabel(position).create(text, Colors().green).metadata;
  };

  const metadataLabelWithConnection = (position: Vector3, text: string) => {
    const groups: Array<Group> = [];
    GroupHelper().AddObjectsTogroups([MetadataLabel(position).create(text, Colors().green).metadata, MetadataLabel(position).create(text, Colors().green).connection], groups)
    return groups;
  };

  const pauseStoryCircleProgress = (_position: Vector3, _storyData: StoryData) => {
    const schema = {
      position: _position,
      params: { radius: Measurements().storyCircle.progressRadius - Measurements().progressBar.thickness / 2, color: Colors().green } as CircleParams,
    } as CircleSchema;
    return PauseProgressbar(_storyData).create(schema);
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

  return {
    testCube,
    testText,
    horizontalProgressbar,
    circularProgressbar,
    circularProgressbarActiveSegments,
    endOfStoryText,
    metadataLabel,
    metadataLabelWithConnection,
    pauseStoryCircleProgress,
    countdownCircle,
  }
};

export default TestSingleComponent