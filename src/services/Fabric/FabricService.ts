import { fabric } from 'fabric';
import { FabricDefaults, fabricdefaults } from './defaults.fabric';
import { router } from '@/router';
import { image } from 'd3';
import Positions from '@/Three/defaults.positions';

type State = {
  canvas: any;
  selectedImage: any;
  positions: Array<Position>;
};

type Scale = {
  scaleX: number;
  scaleY: number;
};

type Position = {
  left: number;
  top: number;
};

export default class FabricService {
  state: State;

  constructor() {
    this.state = {
      canvas: this.setupFabric(),
      selectedImage: undefined,
      positions: this.getAvailablePositions(),
    };
    this.setMainImageOnClick();
  }

  setupFabric() {
    const canvas = new fabric.Canvas('canvas');
    canvas.preserveObjectStacking = true; // keep z-index of selected objects
    canvas.selection = false; // no group selection
    canvas.setHeight(fabricdefaults.canvas.dimensions.height);
    canvas.setWidth(fabricdefaults.canvas.dimensions.width);
    canvas.setBackgroundColor('#F0EDE6');
    return canvas;
  }

  lockObjectMovement(object: any) {
    object.lockMovementX = true;
    object.lockMovementY = true;
    object.lockScalingX = true;
    object.lockScalingY = true;
    object.setControlsVisibility(fabricdefaults.canvas.selectedImage.controls);
  }

  generateMainImageFrame(entity: any) {
    const image = this.generateImageUrls(entity)[0];
    const frame = new fabric.Image.fromURL(image, (image: any) => {
      image.top = fabricdefaults.canvas.selectedImage.canvasPosition.top;
      image.left = fabricdefaults.canvas.selectedImage.canvasPosition.left;
      image.scaleX = fabricdefaults.canvas.selectedImage.scale.scaleX;
      image.scaleY = fabricdefaults.canvas.selectedImage.scale.scaleY;
      image.originX = fabricdefaults.canvas.selectedImage.origin.originX;
      image.originY = fabricdefaults.canvas.selectedImage.origin.originY;
      this.lockObjectMovement(image);
      image.hoverCursor = 'pointer';
      image.setCoords();
      image.id = entity.id;
      image.entity = entity;
      this.state.canvas.add(image);
      this.state.selectedImage = image;
    });

    return frame;
  }

  async generateSecondaryImageFrames(entities: Array<any>) {
    let positions: Array<Position> = this.state.positions;
    const images: Array<string> = this.generateImageUrls(entities);
    images.forEach((image, index) => {
      const frame = new fabric.Image.fromURL(image, (image: any) => {
        const randomNumber = this.getRandomNumberInRange(0, positions.length - 1);
        image.scaleX = fabricdefaults.canvas.secondaryImage.scale.scaleX;
        image.scaleY = fabricdefaults.canvas.secondaryImage.scale.scaleY;
        image.top = positions[randomNumber].top;
        image.left = positions[randomNumber].left;

        image.type = 'image';
        image.hoverCursor = 'pointer';
        image.id = entities[index].id;
        image.entity = entities[index];
        image.setCoords();
        this.lockObjectMovement(image);
        this.state.canvas.add(image);
        positions = positions.filter((pos: any) => pos != positions[randomNumber]);
      });
    });
  }

  changeFrameScale(frame: any, scale: Scale) {
    frame.scaleX = scale.scaleX;
    frame.scaleY = scale.scaleY;
  }

  setMainImageOnClick() {
    this.state.canvas.on('mouse:down', (selectedObject: any) => {
      if (selectedObject.target) {
        selectedObject = selectedObject.target;
        console.log({ selectedObject });
        router.push('/touchtable/' + selectedObject.id);
        this.state.selectedImage = selectedObject;
      }
    });
  }

  private getAvailablePositions() {
    const availablePositionArray: Array<Position> = [];
    fabricdefaults.canvas.secondaryImage.positions.xAxis.forEach((xPosition) => {
      fabricdefaults.canvas.secondaryImage.positions.yAxis.forEach((yPosition) => {
        availablePositionArray.push({ top: yPosition, left: xPosition });
      });
    });
    return availablePositionArray;
  }

  private getClosestCorner(frame1: any, frame2: any) {
    const centerPoint1 = {
      top: frame1.top + frame1.height / 2,
      left: frame1.left + frame1.width / 2,
    };
    const centerPoint2 = {
      top: frame2.top + frame2.height / 2,
      left: frame2.left + frame2.width / 2,
    };
    if (centerPoint2.left < centerPoint1.left) {
      return 2;
    } else {
      return 3;
    }
  }

  private generateImageUrls(entities: Array<any> | any) {
    const imageUrls: Array<any> = [];
    if (entities instanceof Array) {
      entities.forEach((entity: any) => {
        if (entity.primary_mediafile) {
          imageUrls.push(
            `https://api-uat.collectie.gent/iiif/image/iiif/3/${entity.primary_mediafile}/full/1000,/0/default.jpg`,
          );
        }
      });
    } else {
      if (entities.primary_mediafile) {
        imageUrls.push(
          `https://api-uat.collectie.gent/iiif/image/iiif/3/${entities.primary_mediafile}/full/1000,/0/default.jpg`,
        );
      }
    }
    return imageUrls;
  }

  private getRandomNumberInRange(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  getFrameByEntityId(frameId: string) {
    const foundFrame: any = this.state.canvas
      .getObjects()
      .find((object: any) => object.id == frameId);
    return foundFrame;
  }

  generateRelationBetweenFrames(frameId1: string, frameId2: string) {
    const frame1 = this.getFrameByEntityId(frameId1);
    const frame2 = this.getFrameByEntityId(frameId2);
    if (frame1 && frame2) {
      const closestCornerIndex = this.getClosestCorner(frame1, frame2);
      const line = [
        frame1.getCoords()[0].x,
        frame1.getCoords()[0].y,
        frame2.getCoords()[closestCornerIndex].x,
        frame2.getCoords()[closestCornerIndex].y,
      ];
      const relation = new fabric.Line(line, {
        fill: 'black',
        stroke: 'black',
        strokeWidth: 3,
        selectable: false,
        evented: false,
      });
      this.state.canvas.add(relation);
    }
  }
}
