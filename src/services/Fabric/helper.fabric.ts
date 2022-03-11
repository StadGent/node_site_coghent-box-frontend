import { fabricdefaults } from './defaults.fabric';
import { changeLineColorHelper } from './helper.lines';
import { Coordinate, Scale, Position } from './FabricService';
import { fabric } from 'fabric';
import { Relation, Entity } from 'coghent-vue-3-component-library/lib/queries';
import { iiiF } from '@/main';

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

const availablePositionsInRangeHelper = (
  indexedPosition: Position,
  range: number,
  takenPositions: Array<Position>,
): Array<Position> => {
  let positionsInRange: Array<Position> = indexedPositionsInRangeHelper(
    indexedPosition,
    range,
  );

  positionsInRange.forEach((position: Position) => {
    const blockedPositions =
      fabricdefaults.canvas.secondaryImage.positions.blockedPositions;
    if (
      blockedPositions.length &&
      blockedPositions.find(
        (blockedPosition: Position) =>
          blockedPosition.xIndex == position.xIndex &&
          blockedPosition.yIndex == position.yIndex,
      )
    ) {
      positionsInRange = positionsInRange.filter(
        (positionInRange: Position) => positionInRange != position,
      );
    } else if (
      takenPositions.find(
        (takenPosition: Position) =>
          takenPosition.xIndex == position.xIndex &&
          takenPosition.yIndex == position.yIndex,
      )
    ) {
      positionsInRange = positionsInRange.filter(
        (positionInRange: Position) => positionInRange != position,
      );
    }
    if (
      indexedPosition.xIndex == position.xIndex &&
      indexedPosition.yIndex == position.yIndex
    ) {
      positionsInRange = positionsInRange.filter(
        (positionInRange: Position) => positionInRange != position,
      );
    }
  });

  return positionsInRange;
};

const indexedPositionsInRangeHelper = (indexedPosition: Position, range: number) => {
  const indexedPositions: Position[] = [];

  const startY: number = Math.max(0, indexedPosition.yIndex - range);
  const endY: number = Math.min(
    fabricdefaults.canvas.secondaryImage.positions.yAxis.length - 1,
    indexedPosition.yIndex + range,
  );

  for (let row: number = startY; row <= endY; row++) {
    const xRange: number = range - Math.abs(row - indexedPosition.yIndex);

    const startX: number = Math.max(0, indexedPosition.xIndex - xRange);
    const endX: number = Math.min(
      fabricdefaults.canvas.secondaryImage.positions.xAxis.length - 1,
      indexedPosition.xIndex + xRange,
    );

    for (let col = startX; col <= endX; col++) {
      indexedPositions.push({ xIndex: col, yIndex: row });
    }
  }
  return indexedPositions;
};

const lineSpacingHelper = (bottomCoordinates: Array<Coordinate>) => {
  bottomCoordinates.forEach((coordinate: Coordinate) => {
    coordinate.y = coordinate.y + fabricdefaults.canvas.selectedImage.underline.spacing;
  });
  return bottomCoordinates;
};

const objectIsTypeHelper = (type: string, object: any): boolean =>
  object.objectType == type ? true : false;

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
          (position: Position) => position.xIndex == xIndex && position.yIndex == yIndex,
        )
      ) {
        availablePositionArray.push({ yIndex, xIndex });
      }
    });
  });
  return availablePositionArray;
};

const getPositionByIdHelper = (entityId: string, objectsOnCanvas: Array<any>) => {
  const positionIndexEntity = objectsOnCanvas.find(
    (object: any) => object.id == entityId,
  );
  if (positionIndexEntity) {
    return positionIndexEntity.positionIndexes;
  } else {
    return undefined;
  }
};

const getFrameByEntityIdHelper = (frameId: string, canvasObjects: Array<any>) => {
  const foundFrame: any = canvasObjects.find(
    (object: any) => object.id == frameId && object.objectType == 'frame',
  );
  return foundFrame;
};

const getObjectsByObjectTypeHelper = (canvasObjects: Array<any>, objectType: string) => {
  const foundObjects: any = canvasObjects.filter(
    (object: any) => object.objectType == objectType,
  );
  return foundObjects;
};

const isDuplicateFrameHelper = (newObject: any, canvasObjects: Array<any>): Boolean => {
  if (canvasObjects.find((object: any) => object.id == newObject.id)) {
    return true;
  } else {
    return false;
  }
};

const moveObjectOnZAxisHelper = (object: any, move: string) => {
  if (move === 'front') {
    object.bringToFront();
  }
  if (move === 'back') {
    object.sendToBack();
  }
};

const canvasTextHelper = (
  coordinate: Coordinate,
  text: string,
  origin: { originX: string; originY: string },
  size: number,
  fontFamily: string,
  fontWeight: string,
) => {
  const textbox = new fabric.Textbox(text, {
    top: coordinate.y,
    left: coordinate.x,
    fontSize: size,
    originX: origin.originX,
    originY: origin.originY,
    fontFamily: fontFamily,
    fontWeight: fontWeight,
    hoverCursor: 'default',
    selectable: false,
  });
  lockObjectMovementHelper(textbox);
  return textbox;
};

const ImageUrlHelper = (entities: Array<any> | any) => {
  const { generateUrl, noImageUrl } = iiiF;
  const imageUrls: Array<any> = [];
  if (entities instanceof Array) {
    entities.forEach((entity: any) => {
      if (entity.primary_mediafile || entity.mediafiles[0].filename) {
        const image = entity.primary_mediafile || entity.mediafiles[0].filename;
        imageUrls.push(generateUrl(image, 'full', '', 150));
      }
    });
  } else {
    if (entities.primary_mediafile || entities.mediafiles[0].filename) {
      const image = entities.primary_mediafile || entities.mediafiles[0].filename;
      imageUrls.push(generateUrl(image, 'full', '', 150));
    }
  }
  return imageUrls;
};

const IIIFImageUrlHelper = (entity: any): string => {
  const { generateInfoUrl } = iiiF;
  const filename = entity.primary_mediafile || entity.mediafiles[0].filename;

  return generateInfoUrl(filename);
};

const frameBorderHighlightHelper = (frame: any, highlight: boolean) => {
  frame.stroke = highlight
    ? fabricdefaults.canvas.relationBrowser.selectedRelationBorder.color
    : undefined;
  frame.strokeWidth = highlight
    ? fabricdefaults.canvas.relationBrowser.selectedRelationBorder.stroke
    : 0;
};

const relationHighlightHelper = (relation: any) => {
  changeLineColorHelper(relation, '#b65099');
  relation.opacity = 1;
};

const unHighlightCanvasObjectsHelper = (canvasObjects: Array<any>) => {
  canvasObjects.forEach((canvasObject: any) => {
    objectOpacityHelper(canvasObject, 1);
    if (objectIsTypeHelper('frame', canvasObject)) {
      frameBorderHighlightHelper(canvasObject, false);
    }
  });
};

const isRelationOnFrameHelper = (frame: any, relation: any): Boolean => {
  const relationOnFrame: Boolean = frame.entity.relations.find(
    (canvasRelation: Relation) => canvasRelation.key == relation.key,
  )
    ? true
    : false;

  return relationOnFrame;
};

const objectOpacityHelper = (canvasObject: any, opacity: number) => {
  canvasObject.opacity = opacity;
};

const getRandomNumberInRangeHelper = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

const lockObjectMovementHelper = (object: any) => {
  object.lockMovementX = true;
  object.lockMovementY = true;
  object.lockScalingX = true;
  object.lockScalingY = true;
  object.setControlsVisibility(fabricdefaults.canvas.selectedImage.controls);
};

export {
  underlineHelper,
  changeFrameScaleHelper,
  ImageUrlHelper,
  availablePositionHelper,
  getRandomNumberInRangeHelper,
  indexedPositionsInRangeHelper,
  isDuplicateFrameHelper,
  getFrameByEntityIdHelper,
  getPositionByIdHelper,
  lockObjectMovementHelper,
  availablePositionsInRangeHelper,
  objectIsTypeHelper,
  frameBorderHighlightHelper,
  objectOpacityHelper,
  relationHighlightHelper,
  canvasTextHelper,
  getObjectsByObjectTypeHelper,
  moveObjectOnZAxisHelper,
  IIIFImageUrlHelper,
  unHighlightCanvasObjectsHelper,
  isRelationOnFrameHelper,
};
