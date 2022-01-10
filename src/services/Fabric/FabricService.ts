import { fabric } from 'fabric';
import { fabricdefaults } from './defaults.fabric';

type State = {
  canvas: any;
  selectedImage: any;
};

export default class FabricService {
  state: State;

  constructor() {
    this.state = {
      canvas: this.setupFabric(),
      selectedImage: undefined,
    };
    this.removeNewFrameOnCollision();
  }

  setupFabric() {
    const canvas = new fabric.Canvas('canvas');
    canvas.preserveObjectStacking = true; // keep z-index of selected objects
    canvas.selection = false; // no group selection
    canvas.setDimensions({
      width: fabricdefaults.canvas.dimensions.width,
      height: fabricdefaults.canvas.dimensions.height,
    });
    return canvas;
  }

  lockObjectMovement(object: any) {
    object.lockMovementX = true;
    object.lockMovementY = true;
    object.lockScalingX = true;
    object.lockScalingY = true;
    object.setControlsVisibility(fabricdefaults.canvas.selectedImage.controls);
  }

  generateMainImageFrame(image: string) {
    const frame = new fabric.Image.fromURL(image, (image: any) => {
      image.top = fabricdefaults.canvas.selectedImage.canvasPosition.top;
      image.left = fabricdefaults.canvas.selectedImage.canvasPosition.left;
      image.scaleX = fabricdefaults.canvas.selectedImage.scale.scaleX;
      image.scaleY = fabricdefaults.canvas.selectedImage.scale.scaleY;
      image.originX = fabricdefaults.canvas.selectedImage.origin.originX;
      image.originY = fabricdefaults.canvas.selectedImage.origin.originY;
      this.lockObjectMovement(image);
      this.state.canvas.add(image);
      this.state.selectedImage = image;
    });

    return frame;
  }

  async generateSecondaryImageFrames(images: Array<string>) {
    const frames: Array<any> = [];
    images.forEach((image) => {
      const frame = new fabric.Image.fromURL(image, (image: any) => {
        image.scaleX = fabricdefaults.canvas.secondaryImage.scale.scaleX;
        image.scaleY = fabricdefaults.canvas.secondaryImage.scale.scaleY;
        image.top = Math.floor(Math.random() * fabricdefaults.canvas.dimensions.height);
        image.left = Math.floor(Math.random() * fabricdefaults.canvas.dimensions.width);
        image.type = 'image';
        this.lockObjectMovement(image);
        this.state.canvas.add(image);
      });
      frames.push(frame);
    });
    await this.generateRelationBetweenFrames();
    return frames;
  }

  removeNewFrameOnCollision() {
    this.state.canvas.on('object:added', (newObject: any) => {
      newObject = newObject.target;
      if (newObject.type == 'image') {
        const objectsOnCanvas: Array<any> = this.state.canvas
          .getObjects()
          .filter((object: any) => object != newObject);
        if (objectsOnCanvas.length >= 1) {
          objectsOnCanvas.forEach((object) => {
            const collision = newObject.intersectsWithObject(object);
            if (collision) {
              this.state.canvas.remove(newObject);
              this.generateSecondaryImageFrames([newObject.getSrc()]);
            }
          });
        }
      }
    });
  }

  private getClosestCorner(frame1: any, frame2: any) {
    const boundingBox1 = frame1.getBoundingRect;
    const boundingBox2 = frame2.getBoundingRect;
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

  generateRelationBetweenFrames() {
    setTimeout(() => {
      console.log(this.state.canvas.getObjects());
      const frame1 = this.state.selectedImage;
      const frame2 = this.state.canvas.getObjects()[3];
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
    }, 500);
  }
}
