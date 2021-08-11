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
  scaleX: number,
  scaleY: number,
  scale: (scaling: number) => void,
  rotate: (rotation: number) => void,
  set: (object: {}) => void,
  source?: object,
  title?: Textbox,
  data: object,
  metadata: Metadata[],
  lines: {going: object[], coming: object[]}
}

export interface Textbox {
  id: string,
  left: number,
  top: number,
  width: number,
  height: number,
  fill: string,
  stroke: string,
  strokeWidth: number,
  scaleX: number,
  scaleY: number,
  scale: (scaling: number) => void,
  rotate: (rotation: number) => void,
  set: (object: {}) => void,
}