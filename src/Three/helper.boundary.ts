import { Zone } from '@/services/ZoneService';
import { Vector3 } from 'three';
import Layers from './defaults.layers';

export type Boundary = {
  TopLeft: Vector3,
  TopRight: Vector3,
  BottomLeft: Vector3,
  BottomRight: Vector3,
};

const BoundaryHelper = (_zone: Zone, padding: number): {
  createOuterBoundary: () => Boundary;
  createInnerBoundary: () => Boundary;
} => {

  const createOuterBoundary = () => {
    return {
      TopLeft: new Vector3(_zone.start.x, _zone.start.y + (_zone.height / 2), Layers.scene),
      TopRight: new Vector3(_zone.end.x, _zone.end.y + (_zone.height / 2), Layers.scene),
      BottomLeft: new Vector3(_zone.start.x, _zone.start.y - (_zone.height/2), Layers.scene),
      BottomRight: new Vector3(_zone.end.x, _zone.end.y - (_zone.height/2), Layers.scene)
    } as Boundary;
  }
  const createInnerBoundary = () => {
    return {
      TopLeft: new Vector3(_zone.start.x + padding, _zone.start.y - ((_zone.height - padding) / 2), Layers.scene),
      TopRight: new Vector3(_zone.end.x - padding, _zone.end.y - ((_zone.height - padding) / 2), Layers.scene),
      BottomLeft: new Vector3(_zone.start.x + padding, _zone.start.y + ((_zone.height - padding) / 2), Layers.scene),
      BottomRight: new Vector3(_zone.end.x - padding, _zone.end.y + ((_zone.height - padding) / 2), Layers.scene)
    } as Boundary;
  }
  return { createOuterBoundary, createInnerBoundary };
};

export default BoundaryHelper;