import { fabricdefaults } from './defaults.fabric';
import { changeLineColorHelper } from './helper.lines';
import { Coordinate, Scale, Position, CanvasObjectType } from './FabricService';
import { fabric } from 'fabric';
import { Relation, Entity } from 'coghent-vue-3-component-library/lib/queries';
import { iiiF } from '@/main';

const objectIsTypeHelper = (type: CanvasObjectType, object: any): boolean =>
  object.objectType == type ? true : false;

const changeFrameScaleHelper = (frame: any, scale: Scale) => {
  frame.scaleX = scale.scaleX;
  frame.scaleY = scale.scaleY;
};

const getFrameByEntityIdHelper = (frameId: string, canvasObjects: Array<any>): any => {
  const foundFrame: any = canvasObjects.find(
    (object: any) =>
      object.id == frameId &&
      (object.objectType == 'frame' || object.objectType == 'mainFrame'),
  );
  return foundFrame;
};

const getObjectsByObjectTypeHelper = (
  canvasObjects: Array<any>,
  objectType: CanvasObjectType[],
): any[] => {
  const foundObjects: any = canvasObjects.filter((object: any) =>
    objectType.includes(object.objectType),
  );
  return foundObjects;
};

const isDuplicateFrameHelper = (
  newObjectId: any,
  canvasObjectIds: Array<string>,
): Boolean => {
  if (canvasObjectIds.includes(newObjectId)) {
    return true;
  } else {
    return false;
  }
};

const moveObjectOnZAxisHelper = (object: any, move: string): void => {
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
  const textbox = new fabric.Text(text, {
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
    const noImageUrl: string = '/no-image-150.png';
    const imageUrls: Array<string> = [];

    entities.forEach((entity: any) => {
      if (entity.mediafiles[0]?.mediatype.audio) {
        imageUrls.push('/audiothumbnail-150.png');
      } else if (
        entity.primary_transcode ||
        entity.primary_mediafile ||
        entity.mediafiles[0]?.filename
      ) {
        const image =
          entity.primary_transcode ||
          entity.primary_mediafile ||
          entity.mediafiles[0].filename;
        const requestHeight =
          height instanceof Array
            ? height[getRandomNumberInRangeHelper(0, height.length)]
            : height;
        imageUrls.push(generateUrl(image, 'full', '', requestHeight));
      } else {
        imageUrls.push(noImageUrl);
      }
    });

    return Promise.resolve(imageUrls as Array<string>);
  } catch (e) {
    console.warn(`Image url could not be constructed: ${e}`);
    return Promise.reject(e);
  }
};

const IIIFImageUrlHelper = (filename: string): string => {
  const { generateInfoUrl } = iiiF;
  return generateInfoUrl(filename);
};

const frameBorderHighlightHelper = (frame: any, highlight: boolean): void => {
  frame.stroke = highlight
    ? fabricdefaults.canvas.relationBrowser.selectedRelationBorder.color
    : undefined;
  frame.strokeWidth = highlight
    ? fabricdefaults.canvas.relationBrowser.selectedRelationBorder.stroke
    : 0;
};

const relationHighlightHelper = (relation: any): void => {
  changeLineColorHelper(relation, '#b65099');
  relation.opacity = 1;
};

const unHighlightCanvasObjectsHelper = (canvasObjects: Array<any>): void => {
  canvasObjects.forEach((canvasObject: any) => {
    objectOpacityHelper(canvasObject, 1);
    if (objectIsTypeHelper('frame', canvasObject)) {
      frameBorderHighlightHelper(canvasObject, false);
    }
  });
};

const isRelationOnFrameHelper = (frame: any, relation: any): boolean => {
  const relationOnFrame: boolean = frame.entity.relations.find(
    (canvasRelation: Relation) => canvasRelation.key == relation.key,
  )
    ? true
    : false;

  return relationOnFrame;
};

const excludeUnusedRelations = (canvas: any, relations: Relation[]): Relation[] => {
  const canvasFrames: any[] = getObjectsByObjectTypeHelper(canvas.getObjects(), [
    'frame',
  ]);
  const relationsPresentOnCanvas: Relation[] = [];
  canvasFrames.map((frame: any) => [
    relationsPresentOnCanvas.push(...frame.entity.relations),
  ]);
  const resultArray: Relation[] = relations.filter((relation: Relation) =>
    relationsPresentOnCanvas
      .map((presentRelation: Relation) => presentRelation.key)
      .includes(relation.key),
  );
  return resultArray;
};

const objectOpacityHelper = (canvasObject: any, opacity: number) => {
  canvasObject.opacity = opacity;
};

const getRandomNumberInRangeHelper = (min: number, max: number): number => {
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
  excludeUnusedRelations,
};
