import { BufferGeometry, Group, Material, Mesh, Vector3 } from 'three';
import Colors from './defaults.color';
import Defaults from './defaults.config';
import HelperText from './defaults.helperText';
import Measurements from './defaults.measurements';
import GroupHelper from './helper.group';
import TextHelper from './helper.text';
import { CircleSchema } from './schema.circle';
import CircularProgressBar from './shapes.circularProgressbar';
import HorizontalProgressBar from './shapes.horizontalProgressBar';

const TestSingleComponent = (): {
  horizontalProgressbar: Array<Group>;
  circularProgressbar: Mesh<BufferGeometry, Material | Material[]>;
  circularProgressbarActiveSegments: (position: Vector3) => {
    object: Group[];
    dotSchemas: CircleSchema[];
  };
  endOfStoryText: (position: Vector3) => Group;
} => {
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

  return {
    horizontalProgressbar,
    circularProgressbar,
    circularProgressbarActiveSegments,
    endOfStoryText,
  }
}

export default TestSingleComponent