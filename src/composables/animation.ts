import AnimationDefaults from '@/Three/defaults.animation';
import { Mesh, MeshBasicMaterial } from 'three';
import Common from './common';

const CustomAnimation = (): {
  fadeOut: (object: Mesh<any, MeshBasicMaterial>, fadeTo: number, step: number) => Promise<void>;
  fadeIn: (object: Mesh<any, MeshBasicMaterial>, fadeTo: number, step: number) => Promise<void>;
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

  return {
    fadeOut,
    fadeIn,
  }
};

export default CustomAnimation;