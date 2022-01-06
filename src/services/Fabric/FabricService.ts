import { fabric } from 'fabric';
import { fabricdefaults } from './defaults.fabric';

type State = {
  canvas: any;
};

type BoundingBox = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export default class FabricService {
  state: State;

  constructor() {
    this.state = { canvas: this.setupFabric() };
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
      this.lockObjectMovement(image);
      this.state.canvas.add(image);
    });

    return frame;
  }

  generateSecondaryImageFrames(images: Array<string>): Array<any> {
    const frames: Array<any> = [];
    images.forEach((image) => {
      const frame = new fabric.Image.fromURL(image, (image: any) => {
        image.top = Math.floor(Math.random() * fabricdefaults.canvas.dimensions.height);
        image.left = Math.floor(Math.random() * fabricdefaults.canvas.dimensions.width);
        image.scaleX = fabricdefaults.canvas.secondaryImage.scale.scaleX;
        image.scaleY = fabricdefaults.canvas.secondaryImage.scale.scaleY;
        this.lockObjectMovement(image);
        this.state.canvas.add(image);
        frames.push(frame);
      });
    });
    return frames;
  }

  detectCollisionBetweenFrames(
    newObjectBoundingBox: BoundingBox,
    canvasObjectBoundingBox: BoundingBox,
  ) {
    if (
      newObjectBoundingBox.left <
        canvasObjectBoundingBox.left + canvasObjectBoundingBox.width &&
      newObjectBoundingBox.left + newObjectBoundingBox.width >
        canvasObjectBoundingBox.left &&
      newObjectBoundingBox.top <
        canvasObjectBoundingBox.top + canvasObjectBoundingBox.height &&
      newObjectBoundingBox.height + newObjectBoundingBox.top > canvasObjectBoundingBox.top
    ) {
      // collision detected!
      return true;
    } else {
      // no collision
      return false;
    }
  }

  removeNewFrameOnCollision() {
    this.state.canvas.on('object:added', (newObject: any) => {
      newObject = newObject.target;
      const objectsOnCanvas: Array<any> = this.state.canvas
        .getObjects()
        .filter((object: any) => object != newObject);
      const newObjectBoundingBox = newObject.getBoundingRect();
      if (objectsOnCanvas.length >= 1) {
        objectsOnCanvas.forEach((object) => {
          const canvasObjectBoundingBox = object.getBoundingRect();
          const collision = this.detectCollisionBetweenFrames(
            newObjectBoundingBox,
            canvasObjectBoundingBox,
          );
          if (collision) {
            this.state.canvas.remove(newObject);
            this.generateSecondaryImageFrames([newObject.getSrc()]);
            console.log(this.state.canvas.getObjects());
          }
        });
      }
    });
  }
}
