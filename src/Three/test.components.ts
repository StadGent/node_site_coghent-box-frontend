import { Group, Vector3 } from 'three';
import Colors from './defaults.color';
import HorizontalProgressBar from './shapes.horizontalProgressBar';

const TestSingleComponent = (): {
  horizontalProgressbar: Array<Group>;
} => {
  const horizontalProgressbar = HorizontalProgressBar().create(new Vector3(0,-7,1), [0,3,6], 8, 0.1, Colors().yellow);

  return {
    horizontalProgressbar,
  }
}

export default TestSingleComponent