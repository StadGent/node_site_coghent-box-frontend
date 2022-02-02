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

export {
  underlineHelper,
  changeFrameScaleHelper,
  ImageUrlHelper,
  availablePositionHelper,
};
