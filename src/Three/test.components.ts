import { BufferGeometry, Group, Material, Mesh, Vector3 } from 'three';
import Colors from './defaults.color';
import Defaults from './defaults.config';
import Measurements from './defaults.measurements';
import { CircleSchema } from './schema.circle';
import CircularProgressBar from './shapes.circularProgressbar';
import HorizontalProgressBar from './shapes.horizontalProgressBar';

const TestSingleComponent = (): {
  horizontalProgressbar: Array<Group>;
  circularProgressbar: Mesh<BufferGeometry, Material | Material[]>;
  circularProgressbarActiveSegments: (position: Vector3) => {
    object: Group[];
    dotSchemas: CircleSchema[];
}
} => {
  const horizontalProgressbar = HorizontalProgressBar().create(new Vector3(0,-7,1), [0,3,6], 8, 0.1, Colors().yellow);

  const circularProgressbar = CircularProgressBar().create(new Vector3(0,0,0), Measurements().storyCircle.radius,3,1,Colors().yellow);
  const circularProgressbarActiveSegments = (position: Vector3) =>  CircularProgressBar().createActiveSegment(position, Measurements().storyCircle.radius,3,3,Colors().yellow);

  return {
    horizontalProgressbar,
    circularProgressbar,
    circularProgressbarActiveSegments,
  }
}

export default TestSingleComponent