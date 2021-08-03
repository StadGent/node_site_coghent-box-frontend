export interface Square {
  id: string,
  left: number,
  top: number,
  width: number,
  height: number,
  fill: string,
  scale: (scaling: number) => void,
  rotate: (rotation: number) => void,
  set: (object: {}) => void,
  source?: object,
  title?: object,
  lines: {going: object[], coming: object[]}
}