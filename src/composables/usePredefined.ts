import {
  Mesh,
  CircleGeometry,
  MeshBasicMaterial,
  Line,
  BufferGeometry,
  LineBasicMaterial,
} from 'three';
import useBaseChapes from './baseChapes';
import useChapeHelpers from './useChapeHelpers';

const usePredefined = (): {
  BaseStoryCircle: () => (
    | Mesh<CircleGeometry, MeshBasicMaterial>
    | Line<BufferGeometry, LineBasicMaterial>
  )[];
} => {
  const baseChapeHelper = useBaseChapes();
  const chapeHelper = useChapeHelpers();

  const BaseStoryCircle = () => {
    const circle = baseChapeHelper.Circle(2, 0x02a77f);
    const pos1 = chapeHelper.CalculatePointOfCircle(
      45,
      circle.geometry.parameters.radius,
    );
    const pos2 = chapeHelper.CalculatePointOfCircle(
      -45,
      circle.geometry.parameters.radius,
    );
    const pos3 = chapeHelper.CalculatePointOfCircle(
      160,
      circle.geometry.parameters.radius,
    );
    const pos4 = chapeHelper.CalculatePointOfCircle(
      -160,
      circle.geometry.parameters.radius,
    );

    const lineR1 = baseChapeHelper.AngledLineRight({
      x: pos1.x,
      y: pos1.y,
    });
    const lineR2 = baseChapeHelper.AngledLineRight(
      {
        x: pos2.x,
        y: pos2.y,
      },
      false,
    );
    const lineL1 = baseChapeHelper.AngledLineLeft({
      x: pos3.x,
      y: pos3.y,
    });
    const lineL2 = baseChapeHelper.AngledLineLeft(
      {
        x: pos4.x,
        y: pos4.y,
      },
      false,
    );
    chapeHelper.GetLineParams(lineL2);
    return [circle, lineR1, lineR2, lineL1, lineL2];
  };
  return { BaseStoryCircle };
};

export default usePredefined;
