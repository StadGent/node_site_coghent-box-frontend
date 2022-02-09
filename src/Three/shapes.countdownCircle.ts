import Common from '@/composables/common';
import { Vector3, RingGeometry, MeshBasicMaterial, Mesh, MathUtils } from 'three';
import Colors from './defaults.color';
import Measurements from './defaults.measurements';

const CountDownCircle = (_position: Vector3, _progress: number, _radius: number, _thickness: number, _color?: number) => {
    const geometry = new RingGeometry(
      _radius,
      _radius + _thickness,
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
}

export default CountDownCircle;