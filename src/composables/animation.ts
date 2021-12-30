import AnimationDefaults from '@/Three/defaults.animation';
import { Mesh, MeshBasicMaterial } from 'three';
import Common from './common';

const CustomAnimation = (): {
  fadeOut: (object: Mesh<any, MeshBasicMaterial>, fadeTo: number, step: number) => Promise<void>;
  fadeIn: (object: Mesh<any, MeshBasicMaterial>, fadeTo: number, step: number) => Promise<void>;
  grow: (object: Mesh<any, MeshBasicMaterial>, scaleTo: number, step: number) => Promise<void>;
  shrink: (object: Mesh<any, MeshBasicMaterial>, scaleTo: number, step: number) => Promise<void>;
} => {

  const fadeOut = async (object: Mesh<any, MeshBasicMaterial>, fadeTo: number, step: number) => {
    while (object.material.opacity - step >= fadeTo) {
      await Common().awaitTimeout(AnimationDefaults.timing.fadeUpdateTime);
      object.material.opacity -= step;
    }
  };

  const fadeIn = async (object: Mesh<any, MeshBasicMaterial>, fadeTo: number, step: number) => {
    while (object.material.opacity + step <= fadeTo) {
      await Common().awaitTimeout(AnimationDefaults.timing.fadeUpdateTime);
      object.material.opacity += step;
    }
  };

  const grow = async (object: Mesh<any, MeshBasicMaterial>, scaleTo: number, step: number) => {
    while(object.scale.x + step < scaleTo){
      await Common().awaitTimeout(AnimationDefaults.timing.scaleUpdateTime);
      object.scale.set(object.scale.x + step, object.scale.x + step, object.scale.x + step)
    }
  };

  const shrink = async (object: Mesh<any, MeshBasicMaterial>, scaleTo: number, step: number) => {
    while(object.scale.x - step > scaleTo){
      await Common().awaitTimeout(AnimationDefaults.timing.scaleUpdateTime);
      object.scale.set(object.scale.x - step, object.scale.x - step, object.scale.x - step)
    }
  };

  return {
    fadeOut,
    fadeIn,
    grow,
    shrink,
  }
};

export default CustomAnimation;