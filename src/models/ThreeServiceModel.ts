import {
  Line,
  BufferGeometry,
  LineBasicMaterial,
  Mesh,
  CircleGeometry,
  MeshBasicMaterial,
} from 'three';

export type Coordinates = {
  start: Position;
  end: Position;
};

export type Position = {
  x: number;
  y: number;
};

export type Story = {
  lines: Line<BufferGeometry, LineBasicMaterial>[];
  circles: Mesh<CircleGeometry, MeshBasicMaterial>[];
};
