import { fabricdefaults } from './defaults.fabric';
import { changeLineColorHelper } from './helper.lines';
import { Coordinate, Scale, Position } from './FabricService';
import { fabric } from 'fabric';
import { Relation, Entity } from 'coghent-vue-3-component-library/lib/queries';
import { iiiF } from '@/main';

const objectIsTypeHelper = (type: string, object: any): boolean =>
  object.objectType == type ? true : false;

const changeFrameScaleHelper = (frame: any, scale: Scale) => {
  frame.scaleX = scale.scaleX;
  frame.scaleY = scale.scaleY;
};

const getFrameByEntityIdHelper = (frameId: string, canvasObjects: Array<any>): any => {
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

const ImageUrlHelper = (
  entities: Array<any>,
  height: number[] | number = 150,
): Promise<string[]> => {
  try {
    const { generateUrl } = iiiF;
    const imageUrls: Array<string> = [];

    entities.forEach((entity: any) => {
      if (entity.primary_mediafile || entity.mediafiles[0].filename) {
        const image = entity.primary_mediafile || entity.mediafiles[0].filename;
        const requestHeight =
          height instanceof Array
            ? height[getRandomNumberInRangeHelper(0, height.length)]
            : height;
        imageUrls.push(generateUrl(image, 'full', '', requestHeight));
      }
    });

    return Promise.resolve(imageUrls as Array<string>);
  } catch (e) {
    console.warn(`Image url could not be constructed: ${e}`);
    return Promise.reject(e);
  }
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
  changeFrameScaleHelper,
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
  IIIFImageUrlHelper,
  unHighlightCanvasObjectsHelper,
  isRelationOnFrameHelper,
};
