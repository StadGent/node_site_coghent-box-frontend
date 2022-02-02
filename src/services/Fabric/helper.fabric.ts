import { fabricdefaults } from './defaults.fabric';
import { Coordinate } from './FabricService';
import { fabric } from 'fabric';

const underlineHelper = (mainImage: any) => {
  const imageCoordinates: Array<Coordinate> = mainImage.getCoords();
  console.log({ imageCoordinates });
  const bottomCoordinates: Array<Coordinate> = [
    { key: 'bl', x: imageCoordinates[2].x, y: imageCoordinates[2].y },
    { key: 'br', x: imageCoordinates[3].x, y: imageCoordinates[3].y },
  ];
  const spacedCoordinates = lineSpacingHelper(bottomCoordinates);
  const underline = [
    bottomCoordinates.find((coordinate: Coordinate) => coordinate.key == 'bl')?.x,
    bottomCoordinates.find((coordinate: Coordinate) => coordinate.key == 'bl')?.y,
    bottomCoordinates.find((coordinate: Coordinate) => coordinate.key == 'br')?.x,
    bottomCoordinates.find((coordinate: Coordinate) => coordinate.key == 'br')?.y,
  ];
  const lineObject = new fabric.Line(underline, {
    fill: fabricdefaults.canvas.selectedImage.underline.color,
    stroke: fabricdefaults.canvas.selectedImage.underline.color,
    strokeWidth: 5,
    selectable: false,
    evented: false,
  });
  return lineObject;
};

const lineSpacingHelper = (bottomCoordinates: Array<Coordinate>) => {
  bottomCoordinates.forEach((coordinate: Coordinate) => {
    coordinate.y = coordinate.y + fabricdefaults.canvas.selectedImage.underline.spacing;
  });
  return bottomCoordinates;
};

export { underlineHelper };
