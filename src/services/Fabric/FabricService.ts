import { fabric } from 'fabric';
import { fabricdefaults } from './defaults.fabric';
import {
  ImageUrlHelper,
  getRandomNumberInRangeHelper,
  isDuplicateFrameHelper,
  getFrameByEntityIdHelper,
  lockObjectMovementHelper,
  objectIsTypeHelper,
  frameBorderHighlightHelper,
  objectOpacityHelper,
  relationHighlightHelper,
  canvasTextHelper,
  getObjectsByObjectTypeHelper,
  moveObjectOnZAxisHelper,
  unHighlightCanvasObjectsHelper,
  isRelationOnFrameHelper,
} from './helper.fabric';
import { underlineHelper } from './helper.lines';
import {
  getPositionForImageHelper,
  getPositionByIdHelper,
  initialAvailablePositionHelper,
} from './helper.positions';
import { router } from '@/router';
import { Relation, Entity } from 'coghent-vue-3-component-library/lib/queries';
import { useBoxVisiter } from 'coghent-vue-3-component-library';
import { apolloClient } from '@/main';

export type State = {
  canvas: any;
  selectedImage: any;
  positions: Array<Position>;
  takenPositions: Array<Position>;
  canvasEntities: string[];
  secondaryImageAmount: number;
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

export type CanvasObjectType =
  | 'mainFrame'
  | 'frame'
  | 'startFrame'
  | 'historyFrame'
  | 'infoContainer'
  | 'line';

export default class FabricService {
  state: State;

  constructor() {
    this.state = {
      canvas: this.setupFabric(),
      selectedImage: undefined,
      positions: initialAvailablePositionHelper(),
      takenPositions: [],
      canvasEntities: [],
      secondaryImageAmount: 0,
    };
    this.setMainImageOnClick();
  }

  setupFabric() {
    const canvasElement = document.querySelector('.upper-canvas');
    if (canvasElement) {
      canvasElement.remove();
    }
    const canvas = new fabric.Canvas('canvas');
    canvas.preserveObjectStacking = true; // keep z-index of selected objects
    canvas.selection = false;
    canvas.setHeight(fabricdefaults.canvas.dimensions.height);
    canvas.setWidth(fabricdefaults.canvas.dimensions.width);
    canvas.setBackgroundColor('#E5E5E5');
    return canvas;
  }

  generateMainImageFrame(entity: Entity) {
    ImageUrlHelper([entity]).then((images: string[]) => {
      const imageurl = images[0];
      new fabric.Image.fromURL(imageurl, (image: any) => {
        image.top = fabricdefaults.canvas.selectedImage.canvasPosition.top;
        image.left = fabricdefaults.canvas.selectedImage.canvasPosition.left;
        image.originX = fabricdefaults.canvas.selectedImage.origin.originX;
        image.originY = fabricdefaults.canvas.selectedImage.origin.originY;
        image.positionIndexes = {
          xIndex:
            fabricdefaults.canvas.secondaryImage.positions.blockedPositions[0].xIndex,
          yIndex:
            fabricdefaults.canvas.secondaryImage.positions.blockedPositions[0].yIndex,
        };
        lockObjectMovementHelper(image);
        image.hoverCursor = 'pointer';
        image.objectType = 'mainFrame';
        image.setCoords();
        image.id = entity.id;
        image.entity = entity;
        this.state.canvasEntities.push(image.id);
        this.state.canvas.add(image);
        this.state.selectedImage = image;
        const underline = underlineHelper(image);
        this.state.canvas.add(underline);
      });
    });
    return Promise.resolve(entity);
  }

  generateInfoBar(startEntity: Entity, historyEntities: Entity[]) {
    const backgroundRect = new fabric.Rect({
      width: fabricdefaults.canvas.dimensions.width,
      height: fabricdefaults.canvas.infoBar.height,
      originX: 'left',
      originY: 'bottom',
      top: fabricdefaults.canvas.dimensions.height,
      left: 0,
      fill: '#F0EDE6',
      objectType: 'infoContainer',
      hoverCursor: 'default',
      selectable: false,
    });
    lockObjectMovementHelper(backgroundRect);
    this.state.canvas.add(backgroundRect);

    let startFrame = undefined;
    ImageUrlHelper([startEntity]).then((imageArray: string[]) => {
      const startImage: string = imageArray[0];
      new fabric.Image.fromURL(startImage, (image: any) => {
        image.top = fabricdefaults.canvas.infoBar.startFrame.position.top;
        image.left = fabricdefaults.canvas.infoBar.startFrame.position.left;
        image.scaleX = fabricdefaults.canvas.infoBar.startFrame.scale.scaleX;
        image.scaleY = fabricdefaults.canvas.infoBar.startFrame.scale.scaleY;
        image.originX = fabricdefaults.canvas.infoBar.startFrame.origin.originX;
        image.originY = fabricdefaults.canvas.infoBar.startFrame.origin.originY;
        image.objectType = 'startFrame';
        image.hoverCursor = 'pointer';
        image.setCoords();
        image.entity = startEntity;
        lockObjectMovementHelper(image);
        this.state.canvas.add(image);
        startFrame = image;
      });
    });
    const startText = canvasTextHelper(
      fabricdefaults.canvas.infoBar.startFrame.text.position,
      'Start afbeelding',
      fabricdefaults.canvas.infoBar.startFrame.text.origin,
      fabricdefaults.canvas.infoBar.startFrame.text.fontSize,
      fabricdefaults.canvas.infoBar.historyFrame.text.fontFamily,
      'bold',
    );
    this.state.canvas.add(startText);

    if (historyEntities.length) {
      let previousHistoryFrame: any = undefined;
      ImageUrlHelper(historyEntities).then((imageArray: string[]) => {
        imageArray.forEach((historyImage: any, index: number) => {
          new fabric.Image.fromURL(historyImage, (image: any) => {
            image.top = fabricdefaults.canvas.infoBar.historyFrame.position.top;
            image.left = previousHistoryFrame
              ? previousHistoryFrame.left + previousHistoryFrame.width + 25
              : fabricdefaults.canvas.infoBar.historyFrame.position.left;
            image.scaleX = fabricdefaults.canvas.infoBar.historyFrame.scale.scaleX;
            image.scaleY = fabricdefaults.canvas.infoBar.historyFrame.scale.scaleY;
            image.originX = fabricdefaults.canvas.infoBar.historyFrame.origin.originX;
            image.originY = fabricdefaults.canvas.infoBar.historyFrame.origin.originY;
            image.objectType = 'historyFrame';
            image.hoverCursor = 'pointer';
            image.setCoords();
            image.entity = historyEntities[index];
            lockObjectMovementHelper(image);
            this.state.canvas.add(image);
            previousHistoryFrame = image;
          });
        });
      });

      const historyText = canvasTextHelper(
        fabricdefaults.canvas.infoBar.historyFrame.text.position,
        'Geschiedenis',
        fabricdefaults.canvas.infoBar.historyFrame.text.origin,
        fabricdefaults.canvas.infoBar.historyFrame.text.fontSize,
        fabricdefaults.canvas.infoBar.historyFrame.text.fontFamily,
        'bold',
      );
      this.state.canvas.add(historyText);
    }
  }

  generateSecondaryImageFrames(
    entities: Array<any>,
    subRelationOriginEntityId: string,
  ): Promise<Entity[]> {
    const canvasFrames: any[] = getObjectsByObjectTypeHelper(
      this.state.canvas.getObjects(),
      ['frame', 'mainFrame'],
    );
    let originEntityPosition: Position | undefined = undefined;
    if (this.state.takenPositions.length <= this.state.positions.length - 1) {
      originEntityPosition = getPositionByIdHelper(
        subRelationOriginEntityId,
        canvasFrames,
      );
    }

    // Frame object
    ImageUrlHelper(entities, fabricdefaults.canvas.secondaryImage.height).then(
      (images: string[]) => {
        images.forEach((imageUrl, index) => {
          new fabric.Image.fromURL(imageUrl, (image: any) => {
            if (originEntityPosition) {
              image.positionIndexes = getPositionForImageHelper(
                originEntityPosition,
                this.state.takenPositions,
              );
              image.top =
                fabricdefaults.canvas.secondaryImage.positions.yAxis[
                  image.positionIndexes.yIndex
                ];
              image.left =
                fabricdefaults.canvas.secondaryImage.positions.xAxis[
                  image.positionIndexes.xIndex
                ];
              image.hoverCursor = 'pointer';
              image.id = entities[index].id;
              image.entity = entities[index];
              image.setCoords();
              image.relationOriginId = subRelationOriginEntityId;
              image.objectType = 'frame';
              lockObjectMovementHelper(image);
              const originFrame: any = getFrameByEntityIdHelper(
                image.relationOriginId,
                this.state.canvas.getObjects(),
              );
              if (
                !isDuplicateFrameHelper(image.id, this.state.canvasEntities) &&
                this.state.secondaryImageAmount <=
                  fabricdefaults.canvas.secondaryImage.maxAmount
              ) {
                this.state.secondaryImageAmount++;
                this.state.canvasEntities.push(image.id);
                this.state.canvas.add(image);
                this.state.takenPositions.push(image.positionIndexes);
                if (originFrame) {
                  this.generateRelationBetweenFrames(originFrame, image);
                }
              } else {
                const duplicateFrame: any = getFrameByEntityIdHelper(
                  image.id,
                  this.state.canvas.getObjects(),
                );
                if (originFrame && duplicateFrame) {
                  this.generateRelationBetweenFrames(originFrame, duplicateFrame);
                }
              }
            } else {
              return Promise.reject('No available positions found');
            }
          });
        });
        this.state.canvas.requestRenderAll();
      },
    );
    return Promise.resolve(entities);
  }

  setMainImageOnClick() {
    this.state.canvas.on('mouse:down', (selectedObject: any) => {
      if (selectedObject.target) {
        if (
          (selectedObject.target && objectIsTypeHelper('frame', selectedObject.target)) ||
          objectIsTypeHelper('startFrame', selectedObject.target) ||
          objectIsTypeHelper('historyFrame', selectedObject.target)
        ) {
          const { addHistoryAsset } = useBoxVisiter(apolloClient);
          addHistoryAsset(this.state.selectedImage.entity);
          selectedObject = selectedObject.target;
          this.state.selectedImage = selectedObject.entity;

          router.push('/touchtable/' + selectedObject.entity.id);
        }
      }
    });
  }

  clearCanvas() {
    this.state.canvas.clear();
    this.state.selectedImage = undefined;
  }

  highlightRelatedFrames(relation: Relation) {
    const canvasObjects: Array<any> = this.state.canvas.getObjects();
    const canvasFrames: Array<any> = getObjectsByObjectTypeHelper(canvasObjects, [
      'frame',
    ]);

    unHighlightCanvasObjectsHelper(this.state.canvas.getObjects());
    if (relation) {
      canvasFrames.forEach((canvasFrame: any) => {
        const relationOnFrame: Boolean = isRelationOnFrameHelper(canvasFrame, relation);
        if (relationOnFrame && canvasFrame.id != this.state.selectedImage.id) {
          frameBorderHighlightHelper(canvasFrame, true);
        } else if (canvasFrame.id != this.state.selectedImage.id) {
          objectOpacityHelper(canvasFrame, 0.4);
        }
      });
      const canvasRelations: Array<any> = getObjectsByObjectTypeHelper(canvasObjects, [
        'line',
      ]);
      canvasRelations.forEach((canvasRelation: any) => {
        const endFrame: any = getFrameByEntityIdHelper(
          canvasRelation.toId,
          canvasObjects,
        );
        const relationOnEndFrame: Boolean = isRelationOnFrameHelper(endFrame, relation);
        if (relationOnEndFrame) {
          relationHighlightHelper(canvasRelation);
        } else {
          objectOpacityHelper(canvasRelation, 0.2);
        }
      });
    }
    this.state.canvas.renderAll();
  }

  generateRelationBetweenFrames(frame1: any, frame2: any) {
    if (frame1 && frame2) {
      const line = [
        frame1.getCenterPoint().x,
        frame1.getCenterPoint().y,
        frame2.getCenterPoint().x,
        frame2.getCenterPoint().y,
      ];
      const relation = new fabric.Line(line, {
        stroke: 'black',
        strokeWidth: 3,
        selectable: false,
        evented: false,
        fromId: frame1.id,
        toId: frame2.id,
        objectType: 'line',
      });
      this.state.canvas.add(relation);
      moveObjectOnZAxisHelper(relation, 'back');
      const infoContainer = getObjectsByObjectTypeHelper(this.state.canvas.getObjects(), [
        'infoContainer',
      ])[0];
      if (infoContainer) {
        moveObjectOnZAxisHelper(infoContainer, 'back');
      }
    }
  }
}
