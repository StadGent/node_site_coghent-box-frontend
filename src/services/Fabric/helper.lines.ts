import { fabric } from 'fabric';
import { fabricdefaults } from './defaults.fabric';
import { Coordinate, Scale, Position } from './FabricService';

const underlineHelper = (mainImage: any) => {
  const imageCoordinates: Array<Coordinate> = mainImage.getCoords();
  const bottomCoordinates: Array<Coordinate> = [
    { key: 'bl', x: imageCoordinates[2].x, y: imageCoordinates[2].y },
    { key: 'br', x: imageCoordinates[3].x, y: imageCoordinates[3].y },
  ];
  const spacedCoordinates = lineSpacingHelper(bottomCoordinates);
  const underline = [
    spacedCoordinates.find((coordinate: Coordinate) => coordinate.key == 'bl')?.x,
    spacedCoordinates.find((coordinate: Coordinate) => coordinate.key == 'bl')?.y,
    spacedCoordinates.find((coordinate: Coordinate) => coordinate.key == 'br')?.x,
    spacedCoordinates.find((coordinate: Coordinate) => coordinate.key == 'br')?.y,
  ];
  const lineObject = new fabric.Line(underline, {
    fill: fabricdefaults.canvas.selectedImage.underline.color,
    stroke: fabricdefaults.canvas.selectedImage.underline.color,
    strokeWidth: fabricdefaults.canvas.selectedImage.underline.stroke,
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

const changeLineColorHelper = (line: any, color: string) => {
  line.stroke = color;
};

const createDynamicLineHelper = (frame1: any, frame2: any) => {
  console.log('Generating relation');
  if (frame1 && frame2) {
    const frame1CenterPoint = new fabric.Point(
      frame1.getCenterPoint().x,
      frame1.getCenterPoint().y,
    );
    const frame2CenterPoint = new fabric.Point(
      frame2.getCenterPoint().x,
      frame2.getCenterPoint().y,
    );
    const spaceBetweenFrames = frame1.getCenterPoint().x - frame2.getCenterPoint().x;
    const middlePoint1 = new fabric.Point(
      frame1.getCenterPoint().x + spaceBetweenFrames / 2,
      frame1.getCenterPoint().y,
    );
    const middlePoint2 = new fabric.Point(
      frame2.getCenterPoint().x + spaceBetweenFrames / 2,
      frame2.getCenterPoint().y,
    );
    const linePoints = [frame1CenterPoint, middlePoint1, middlePoint2, frame2CenterPoint];

    const line = new fabric.Polyline(linePoints, {
      stroke: 'black',
      fill: '',
      strokeWidth: 3,
      selectable: false,
      evented: false,
      fromId: frame1.id,
      toId: frame2.id,
      objectType: 'line',
    });

    return line;
  }
};

export { createDynamicLineHelper, changeLineColorHelper, underlineHelper };
