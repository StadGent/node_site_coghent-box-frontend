import { BoxGeometry, BufferGeometry, Group, Material, Mesh, MeshBasicMaterial, RingGeometry, Vector3 } from 'three';
import Colors from './defaults.color';
import Defaults from './defaults.config';
import HelperText from './defaults.helperText';
import Measurements from './defaults.measurements';
import GroupHelper from './helper.group';
import TextHelper from './helper.text';
import { CircleParams, CircleSchema } from './schema.circle';
import SchemaCube, { CubeParams, CubeSchema } from './schema.cube';
import CircularProgressBar from './shapes.circularProgressbar';
import HorizontalProgressBar from './shapes.horizontalProgressBar';
import MetadataLabel from './shapes.metadataLabel';
import PauseProgressbar, { PauseProgressbarObjects } from './shapes.pauseProgressbar';

const TestSingleComponent = (): {
  testCube: (_position: Vector3) => Mesh<BoxGeometry, MeshBasicMaterial>;
  horizontalProgressbar: Array<Group>;
  circularProgressbar: Mesh<BufferGeometry, Material | Material[]>;
  circularProgressbarActiveSegments: (position: Vector3) => {
    object: Group[];
    dotSchemas: CircleSchema[];
  };
  endOfStoryText: (position: Vector3) => Group;
  metadataLabel: (position: Vector3, text: string) => Group;
  metadataLabelWithConnection: (position: Vector3, text: string) => Array<Group>;
  pauseStoryCircleProgress: () => PauseProgressbarObjects;
} => {

  const testCube = (_position: Vector3) => {
    return SchemaCube().CreateCube({position: _position, params: {color: Colors().green, width: 1, height: 1, opacity: 0.6} as CubeParams} as CubeSchema);
  };

  const horizontalProgressbar = HorizontalProgressBar().create(new Vector3(0, -7, 1), [0, 3, 6], 8, 0.1, Colors().yellow);

  const circularProgressbar = CircularProgressBar().create(new Vector3(0, 0, 0), Measurements().storyCircle.radius, 3, 1, Colors().yellow);
  
  const circularProgressbarActiveSegments = (position: Vector3) => CircularProgressBar().createActiveSegment(position, Measurements().storyCircle.radius, 3, 3, Colors().yellow);
  
  const endOfStoryText = (position: Vector3) => {
    const text =  TextHelper().CreateTextFromRecord(
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

  const pauseStoryCircleProgress = () => {
    const schema = {
      position: new Vector3(-20, 0, 0),
      params: { radius: Measurements().progressBar.radius, color: Colors().green } as CircleParams,
    } as CircleSchema;
    const segments = 6;
    return PauseProgressbar().create(schema, segments);
  };

  return {
    testCube,
    horizontalProgressbar,
    circularProgressbar,
    circularProgressbarActiveSegments,
    endOfStoryText,
    metadataLabel,
    metadataLabelWithConnection,
    pauseStoryCircleProgress,
  }
}

export default TestSingleComponent