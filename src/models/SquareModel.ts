import { Metadata } from "./CollectionModel";

export interface Square {
  id: string,
  left: number,
  top: number,
  width: number,
  height: number,
  fill: string,
  stroke: string,
  strokeWidth: number,
  scale: (scaling: number) => void,
  rotate: (rotation: number) => void,
  set: (object: {}) => void,
  source?: object,
  title?: object,
  data: object,
  metadata: Metadata[],
  lines: {going: object[], coming: object[]}
}