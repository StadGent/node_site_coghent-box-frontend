import { fabricdefaults } from './defaults.fabric';
import { Coordinate, Scale, Position } from './FabricService';

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

const initialAvailablePositionHelper = () => {
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

export {
  availablePositionsInRangeHelper,
  getPositionByIdHelper,
  indexedPositionsInRangeHelper,
  initialAvailablePositionHelper,
};
