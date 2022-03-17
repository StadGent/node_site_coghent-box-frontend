import { fabric } from 'fabric';
import { fabricdefaults } from './defaults.fabric';
import {
  underlineHelper,
  ImageUrlHelper,
  initialAvailablePositionHelper,
  getRandomNumberInRangeHelper,
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
  unHighlightCanvasObjectsHelper,
  isRelationOnFrameHelper,
} from './helper.fabric';
import { router } from '@/router';
import { Relation, Entity } from 'coghent-vue-3-component-library/lib/queries';
// import { useBoxVisiter } from 'coghent-vue-3-component-library';
// import { apolloClient } from '@/main';

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

export default class FabricService {
  state: State;

  constructor() {
    this.state = {
      canvas: this.setupFabric(),
      selectedImage: undefined,
      positions: initialAvailablePositionHelper(),
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

  generateMainImageFrame(entity: Entity) {
    ImageUrlHelper(entity).then((images: string[]) => {
      const image = images[0];
      const frame = new fabric.Image.fromURL(image, (image: any) => {
        image.top = fabricdefaults.canvas.selectedImage.canvasPosition.top;
        image.left = fabricdefaults.canvas.selectedImage.canvasPosition.left;
        image.scaleX = fabricdefaults.canvas.selectedImage.scale.scaleX;
        image.scaleY = fabricdefaults.canvas.selectedImage.scale.scaleY;
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
        image.objectType = 'frame';
        image.setCoords();
        image.id = entity.id;
        image.entity = entity;
        this.state.canvas.add(image);
        this.state.selectedImage = image;
        const underline = underlineHelper(image);
        this.state.canvas.add(underline);
      });
    });
  }

  generateInfoBar(startEntity: Entity, historyEntity: Entity | undefined) {
    console.log({ startEntity, historyEntity });

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

    ImageUrlHelper(startEntity).then((imageArray: string[]) => {
      const startImage: string = imageArray[0];
      const startFrame = new fabric.Image.fromURL(startImage, (image: any) => {
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

    if (historyEntity) {
      ImageUrlHelper(historyEntity).then((imageArray: string[]) => {
        const historyImage: string = imageArray[0];
        const historyFrame = new fabric.Image.fromURL(historyImage, (image: any) => {
          image.top = fabricdefaults.canvas.infoBar.historyFrame.position.top;
          image.left = fabricdefaults.canvas.infoBar.historyFrame.position.left;
          image.scaleX = fabricdefaults.canvas.infoBar.historyFrame.scale.scaleX;
          image.scaleY = fabricdefaults.canvas.infoBar.historyFrame.scale.scaleY;
          image.originX = fabricdefaults.canvas.infoBar.historyFrame.origin.originX;
          image.originY = fabricdefaults.canvas.infoBar.historyFrame.origin.originY;
          image.objectType = 'historyFrame';
          image.hoverCursor = 'pointer';
          image.setCoords();
          image.entity = historyEntity;
          lockObjectMovementHelper(image);
          this.state.canvas.add(image);
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

  async generateSecondaryImageFrames(
    entities: Array<any>,
    subRelationOriginEntityId: string,
  ) {
    // Get positions around main entity, if none left increase the range
    let range: number = fabricdefaults.canvas.secondaryImage.positions.range;
    let closeAvailablePositions: Array<Position> = availablePositionsInRangeHelper(
      getPositionByIdHelper(subRelationOriginEntityId, this.state.canvas.getObjects()),
      range,
      this.state.takenPositions,
    );
    while (closeAvailablePositions.length <= entities.length) {
      range = range + 1;
      closeAvailablePositions = availablePositionsInRangeHelper(
        getPositionByIdHelper(subRelationOriginEntityId, this.state.canvas.getObjects()),
        range,
        this.state.takenPositions,
      );
    }

    // Frame object
    ImageUrlHelper(entities).then((images: string[]) => {
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
            // Add to canvas and remove position from list
            this.state.canvas.add(image);
            closeAvailablePositions = closeAvailablePositions.filter(
              (pos: any) => pos != closeAvailablePositions[randomNumber],
            );

            this.state.takenPositions.push(image.positionIndexes);
          } else {
            // Generate relation instead of frame
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
      return Promise.resolve();
    });
  }

  setMainImageOnClick() {
    this.state.canvas.on('mouse:down', (selectedObject: any) => {
      if (selectedObject.target) {
        if (
          (selectedObject.target && objectIsTypeHelper('frame', selectedObject.target)) ||
          objectIsTypeHelper('startFrame', selectedObject.target) ||
          objectIsTypeHelper('historyFrame', selectedObject.target)
        ) {
          // const { setHistoryAsset } = useBoxVisiter(apolloClient);
          // setHistoryAsset(this.state.selectedImage.entity);
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

  highlightRelatedFrames(selectedFilterIndex: number, relations: Array<Relation>) {
    const relation: Relation = relations[selectedFilterIndex];

    const canvasObjects: Array<any> = this.state.canvas.getObjects();
    const canvasFrames: Array<any> = getObjectsByObjectTypeHelper(canvasObjects, 'frame');

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
      const canvasRelations: Array<any> = getObjectsByObjectTypeHelper(
        canvasObjects,
        'line',
      );
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
      const infoContainer = getObjectsByObjectTypeHelper(
        this.state.canvas.getObjects(),
        'infoContainer',
      )[0];
      if (infoContainer) {
        moveObjectOnZAxisHelper(infoContainer, 'back');
      }
    }
  }
}
