import { Frame, Asset, Story, ComponentMetadata } from '@/models/GraphqlModel';
import Defaults from '@/Three/defaults.config';
import { Mesh, Vector3 } from 'three';

const Common = (): {
  FilterOutIdAfterSlash: (str: string) => string;
  RemoveEntersFromString: (str: string) => string;
  pixelsToMeters: (pixels: number) => number;
  connectRelationMetadata: (parent: Frame | Story, child: Asset | Frame) => ComponentMetadata;
  moveObject: (object: Mesh, toPosition: Vector3) => void;
} => {

  const FilterOutIdAfterSlash = (str: string) => {
    const index = (str.indexOf('/') as number) + 1;
    const id = str.slice(index);
    return id;
  };

  const RemoveEntersFromString = (str: string) => {
    return str.replace(/\n/g, '');
  };

  const pixelsToMeters = (pixels: number) => {
    return pixels * Defaults().pixelInMeter();
  }

  const connectRelationMetadata = (parent: Frame | Story, child: Asset | Frame) => {
    const metadataForAsset = parent.relationMetadata.filter(metadata => Common().FilterOutIdAfterSlash(metadata.key) == child.id)[0];
    return metadataForAsset;    
  }

  const moveObject = (object: Mesh, toPosition: Vector3) => {
    const stepY = Math.abs(object.position.y - toPosition.y) / Defaults().steps();
    const stepX = Math.abs(object.position.x - toPosition.x) / Defaults().steps();
    if (object.position != toPosition) {
      if (object.position.x < toPosition.x) {
        if (object.position.x + stepX > toPosition.x) {
          object.position.x = toPosition.x;
        } else {
          object.position.set(
            object.position.x + stepX,
            object.position.y + stepY,
            object.position.z,
          );
        }
      }
      if (object.position.x > toPosition.x) {
        if (object.position.x - stepX < toPosition.x) {
          object.position.x = toPosition.x;
        } else {
          object.position.set(
            object.position.x - stepX,
            object.position.y - stepY,
            object.position.z,
          );
        }
      }

      setTimeout(() => moveObject(object, toPosition), Defaults().refreshStep());
    }
  };

  return {
    FilterOutIdAfterSlash,
    RemoveEntersFromString,
    pixelsToMeters,
    connectRelationMetadata,
    moveObject,
  };
};

export default Common;
