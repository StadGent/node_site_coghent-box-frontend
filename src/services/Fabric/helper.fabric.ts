import { fabricdefaults } from './defaults.fabric';
import { Coordinate, Scale, Position } from './FabricService';
import { fabric } from 'fabric';

const underlineHelper = (mainImage: any) => {
  const imageCoordinates: Array<Coordinate> = mainImage.getCoords();
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
    strokeWidth: fabricdefaults.canvas.selectedImage.underline.stroke,
    selectable: false,
    evented: false,
  });
  return lineObject;
};

const coordinateIndexHelper = (coordinate: Coordinate) => {
  const yIndex: number = fabricdefaults.canvas.secondaryImage.positions.yAxis.indexOf(
    coordinate.y,
  );
  const xIndex: number = fabricdefaults.canvas.secondaryImage.positions.xAxis.indexOf(
    coordinate.x,
  );

  return { xIndex, yIndex };
};

const coordinatesInRangeHelper = (startCoordinate: Coordinate, range: number) => {
  const coordinates: Coordinate[] = [];

  const indexedCoordinate = coordinateIndexHelper(startCoordinate);
  console.log(indexedCoordinate);

  const startY: number = Math.max(0, indexedCoordinate.yIndex - range);
  const endY: number = Math.min(
    fabricdefaults.canvas.secondaryImage.positions.yAxis.length - 1,
    indexedCoordinate.yIndex + range,
  );

  for (let row: number = startY; row <= endY; row++) {
    const xRange: number = range - Math.abs(row - indexedCoordinate.yIndex);

    const startX: number = Math.max(0, indexedCoordinate.xIndex - xRange);
    const endX: number = Math.min(
      fabricdefaults.canvas.secondaryImage.positions.xAxis.length - 1,
      indexedCoordinate.xIndex + xRange,
    );

    for (let col = startX; col <= endX; col++) {
      coordinates.push({ x: col, y: row });
    }
  }
  console.log({ coordinates });
  return coordinates;
};

const lineSpacingHelper = (bottomCoordinates: Array<Coordinate>) => {
  bottomCoordinates.forEach((coordinate: Coordinate) => {
    coordinate.y = coordinate.y + fabricdefaults.canvas.selectedImage.underline.spacing;
  });
  return bottomCoordinates;
};

const changeFrameScaleHelper = (frame: any, scale: Scale) => {
  frame.scaleX = scale.scaleX;
  frame.scaleY = scale.scaleY;
};

const availablePositionHelper = () => {
  const availablePositionArray: Array<Position> = [];
  fabricdefaults.canvas.secondaryImage.positions.xAxis.forEach((xPosition, xIndex) => {
    fabricdefaults.canvas.secondaryImage.positions.yAxis.forEach((yPosition, yIndex) => {
      if (
        !fabricdefaults.canvas.secondaryImage.positions.blockedPositions.find(
          (position: any) => position.xIndex == xIndex && position.yIndex == yIndex,
        )
      )
        availablePositionArray.push({ top: yPosition, left: xPosition });
    });
  });
  return availablePositionArray;
};

const ImageUrlHelper = (entities: Array<any> | any) => {
  const imageUrls: Array<any> = [];
  if (entities instanceof Array) {
    entities.forEach((entity: any) => {
      if (entity.primary_mediafile || entity.mediafiles[0].filename) {
        const image = entity.primary_mediafile || entity.mediafiles[0].filename;
        imageUrls.push(
          `https://api-uat.collectie.gent/iiif/image/iiif/3/${image}/full/1000,/0/default.jpg`,
        );
      }
    });
  } else {
    if (entities.primary_mediafile || entities.mediafiles[0].filename) {
      const image = entities.primary_mediafile || entities.mediafiles[0].filename;
      imageUrls.push(
        `https://api-uat.collectie.gent/iiif/image/iiif/3/${image}/full/1000,/0/default.jpg`,
      );
    }
  }
  return imageUrls;
};

const getRandomNumberInRangeHelper = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export {
  underlineHelper,
  changeFrameScaleHelper,
  ImageUrlHelper,
  availablePositionHelper,
  getRandomNumberInRangeHelper,
  coordinatesInRangeHelper,
};
