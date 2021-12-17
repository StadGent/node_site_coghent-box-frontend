import { Vector3 } from 'three';
import CircleHelper from './helper.circle';
import Defaults from './defaults.config';
import DefaultLines from './defaults.lines';

const DefaultsHelper = (): {
  Lines: (position: Vector3) => any;
  CircleConnectPoints: (position: Vector3) => Array<Array<Vector3>>;
} => {
  const Lines = (position: Vector3) => {
    return [
      DefaultLines().line1(position),
      DefaultLines().line2(position),
      DefaultLines().line3(position),
      DefaultLines().line4(position),
      DefaultLines().line5(position),
    ];
  };

  const CircleConnectPoints = (position: Vector3) => {
    return [
      DefaultLines().line1(
        CircleHelper().CalculatePointOfCircle(Defaults().circlePoints()[0], position),
      ),
      DefaultLines().line2(
        CircleHelper().CalculatePointOfCircle(Defaults().circlePoints()[1], position),
      ),
      DefaultLines().line3(
        CircleHelper().CalculatePointOfCircle(Defaults().circlePoints()[2], position),
      ),
      DefaultLines().line4(
        CircleHelper().CalculatePointOfCircle(Defaults().circlePoints()[3], position),
      ),
      DefaultLines().line5(
        CircleHelper().CalculatePointOfCircle(Defaults().circlePoints()[4], position),
      ),
    ] as Array<Array<Vector3>>;
  };

  return { Lines, CircleConnectPoints };
};

export default DefaultsHelper;
