import { fabric } from 'fabric';
import { fabricdefaults } from './defaults.fabric';
import {
  underlineHelper,
  ImageUrlHelper,
  availablePositionHelper,
  getRandomNumberInRangeHelper,
  indexedPositionsInRangeHelper,
  isDuplicateFrameHelper,
  getFrameByEntityIdHelper,
  getPositionIndexesByIdHelper,
  lockObjectMovementHelper,
  availablePositionsInRangeHelper,
  objectIsTypeHelper,
  frameBorderHighlightHelper,
  objectOpacityHelper,
  relationHighlightHelper,
} from './helper.fabric';
import { router } from '@/router';
import { image } from 'd3';

type State = {
  canvas: any;
  selectedImage: any;
  positions: Array<Position>;
  takenPositions: Array<Position>;
};

export type Scale = {
  scaleX: number;
  scaleY: number;
};

export type Position = {
  xIndex: number;
  yIndex: number;
};

export type Coordinate = {
  key?: string;
  x: number;
  y: number;
};

export type Relation = {
  key: string;
  label: string;
};

export default class FabricService {
  state: State;

  constructor() {
    this.state = {
      canvas: this.setupFabric(),
      selectedImage: undefined,
      positions: availablePositionHelper(),
      takenPositions: [],
    };
    this.setMainImageOnClick();
    this.generateRelationOnFrameAdd();
  }

  setupFabric() {
    const canvas = new fabric.Canvas('canvas');
    canvas.preserveObjectStacking = true; // keep z-index of selected objects
    canvas.selection = false; // no group selection
    canvas.setHeight(fabricdefaults.canvas.dimensions.height);
    canvas.setWidth(fabricdefaults.canvas.dimensions.width);
    canvas.setBackgroundColor('#E5E5E5');
    return canvas;
  }

  generateMainImageFrame(entity: any) {
    const image = ImageUrlHelper(entity)[0];
    const frame = new fabric.Image.fromURL(image, (image: any) => {
      image.top = fabricdefaults.canvas.selectedImage.canvasPosition.top;
      image.left = fabricdefaults.canvas.selectedImage.canvasPosition.left;
      image.scaleX = fabricdefaults.canvas.selectedImage.scale.scaleX;
      image.scaleY = fabricdefaults.canvas.selectedImage.scale.scaleY;
      image.originX = fabricdefaults.canvas.selectedImage.origin.originX;
      image.originY = fabricdefaults.canvas.selectedImage.origin.originY;
      image.positionIndexes = {
        xIndex: fabricdefaults.canvas.secondaryImage.positions.blockedPositions[0].xIndex,
        yIndex: fabricdefaults.canvas.secondaryImage.positions.blockedPositions[0].xIndex,
      };
      lockObjectMovementHelper(image);
      image.hoverCursor = 'pointer';
      image.objectType = 'frame';
      image.setCoords();
      image.id = entity.id;
      image.entity = entity;
      this.state.canvas.add(image);
      this.state.selectedImage = image;
      const underline = underlineHelper(image);
      this.state.canvas.add(underline);
    });
  }

  async generateSecondaryImageFrames(
    entities: Array<any>,
    subRelationOriginEntityId: string,
  ) {
    let closeAvailablePositions: Array<Position> = availablePositionsInRangeHelper(
      getPositionIndexesByIdHelper(
        subRelationOriginEntityId,
        this.state.canvas.getObjects(),
      ),
      fabricdefaults.canvas.secondaryImage.positions.range,
      this.state.takenPositions,
    );
    const images: Array<string> = ImageUrlHelper(entities);
    images.forEach((image, index) => {
      const frame = new fabric.Image.fromURL(image, (image: any) => {
        const randomNumber = getRandomNumberInRangeHelper(
          0,
          closeAvailablePositions.length - 1,
        );
        image.positionNumber = randomNumber;
        image.scaleX = fabricdefaults.canvas.secondaryImage.scale.scaleX;
        image.scaleY = fabricdefaults.canvas.secondaryImage.scale.scaleY;
        image.top =
          fabricdefaults.canvas.secondaryImage.positions.yAxis[
            closeAvailablePositions[randomNumber].yIndex
          ];
        image.left =
          fabricdefaults.canvas.secondaryImage.positions.xAxis[
            closeAvailablePositions[randomNumber].xIndex
          ];
        image.positionIndexes = {
          xIndex: closeAvailablePositions[randomNumber].xIndex,
          yIndex: closeAvailablePositions[randomNumber].yIndex,
        };
        image.hoverCursor = 'pointer';
        image.id = entities[index].id;
        image.entity = entities[index];
        image.setCoords();
        image.relationOriginId = subRelationOriginEntityId;
        image.objectType = 'frame';
        lockObjectMovementHelper(image);
        if (!isDuplicateFrameHelper(image, this.state.canvas.getObjects())) {
          this.state.canvas.add(image);
          closeAvailablePositions = closeAvailablePositions.filter(
            (pos: any) => pos != closeAvailablePositions[randomNumber],
          );

          this.state.takenPositions.push(image.positionIndexes);
        } else {
          const existingFrame = getFrameByEntityIdHelper(
            image.id,
            this.state.canvas.getObjects(),
          );
          const relationOriginFrame = getFrameByEntityIdHelper(
            image.relationOriginId,
            this.state.canvas.getObjects(),
          );
          this.generateRelationBetweenFrames(existingFrame, relationOriginFrame);
        }
      });
    });
  }

  setMainImageOnClick() {
    this.state.canvas.on('mouse:down', (selectedObject: any) => {
      if (selectedObject.target) {
        selectedObject = selectedObject.target;
        console.log({ selectedObject });
        this.state.selectedImage = selectedObject.entity;
        router.push('/touchtable/' + selectedObject.id);
      }
    });
  }

  clearCanvas() {
    this.state.canvas.clear();
    this.state.selectedImage = undefined;
  }

  generateRelationOnFrameAdd() {
    this.state.canvas.on('object:added', (newObject: any) => {
      if (
        this.state.canvas.getObjects().length > 0 &&
        objectIsTypeHelper('frame', newObject.target)
      ) {
        this.generateRelationBetweenFrames(
          getFrameByEntityIdHelper(
            newObject.target.relationOriginId,
            this.state.canvas.getObjects(),
          ),
          newObject.target,
        );
      }
    });
  }

  highlightRelatedFrames(selectedFilterIndex: number, relations: Array<Relation>) {
    const relation: Relation = relations[selectedFilterIndex];

    const canvasObjects: Array<any> = this.state.canvas.getObjects();
    const canvasFrames: Array<any> = canvasObjects.filter((object: any) =>
      objectIsTypeHelper('frame', object),
    );

    canvasFrames.forEach((canvasFrame: any) => {
      objectOpacityHelper(canvasFrame, 1);
      frameBorderHighlightHelper(canvasFrame, false);
    });

    if (relation) {
      canvasFrames.forEach((canvasFrame: any) => {
        if (
          canvasFrame.entity.relations.find(
            (canvasRelation: Relation) => canvasRelation.key == relation.key,
          ) &&
          canvasFrame.id != this.state.selectedImage.id
        ) {
          frameBorderHighlightHelper(canvasFrame, true);
          relationHighlightHelper(
            canvasFrame,
            true,
            this.state.canvas.getObjects(),
            this.state.selectedImage,
          );
        } else if (canvasFrame.id != this.state.selectedImage.id) {
          objectOpacityHelper(canvasFrame, 0.4);
        }
        console.log(canvasFrame);
      });
    }
    this.state.canvas.renderAll();
  }

  generateRelationBetweenFrames(frame1: any, frame2: any) {
    console.log('Generating relation');
    if (frame1 && frame2) {
      const line = [
        frame1.getCenterPoint().x,
        frame1.getCenterPoint().y,
        frame2.getCenterPoint().x,
        frame2.getCenterPoint().y,
      ];
      const relation = new fabric.Line(line, {
        fill: 'black',
        stroke: 'black',
        strokeWidth: 3,
        selectable: false,
        evented: false,
        fromId: frame1.id,
        toId: frame2.id,
        objectType: 'line',
      });
      this.state.canvas.add(relation);
      relation.sendToBack();
    }
  }
}
