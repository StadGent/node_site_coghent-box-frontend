import { Line, BufferGeometry, LineBasicMaterial } from 'three';

export type Coordinates = {
  start: Position;
  end: Position;
};

export type Position = {
  x: number;
  y: number;
};

export type CircleParams = {
  radius: number;
  segments: number;
  thetaStart: number;
};

export type BoxParams = {
  width: number;
  height: number;
  depth: number;
  widthSegments: number;
  heightSegments: number;
  depthSegments: number;
};

export type Story = {
  lines: Line<BufferGeometry, LineBasicMaterial>[];
};
