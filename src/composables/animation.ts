import AnimationDefaults from '@/Three/defaults.animation';
import { Group, Mesh, MeshBasicMaterial } from 'three';
import Common from './common';

const CustomAnimation = (): {
  fadeOut: (object: Mesh<any, MeshBasicMaterial>, fadeTo: number, step: number) => Promise<void>;
  fadeOutGroups: (_group: Array<Group>, fadeTo: number, step: number) => Promise<void>;
  fadeInGroups: (_group: Array<Group>, fadeTo: number, step: number) => Promise<void>;
  fadeIn: (object: Mesh<any, MeshBasicMaterial>, fadeTo: number, step: number) => Promise<void>;
  grow: (object: Mesh<any, MeshBasicMaterial>, scaleTo: number, step: number) => Promise<void>;
  shrink: (object: Mesh<any, MeshBasicMaterial>, scaleTo: number, step: number) => Promise<void>;
} => {

  const fadeOut = async (object: Mesh<any, MeshBasicMaterial>, fadeTo: number, step: number) => {
    while (object.material.opacity - step >= fadeTo) {
      await Common().awaitTimeout(AnimationDefaults.timing.fadeUpdateTime);
      object.material.opacity -= step;
    }
    Promise.resolve();
  };

  const fadeOutGroups = async (_groups: Array<Group>, fadeTo: number, step: number) => {
    _groups.forEach(_el => {
      _el.children.map(async (_child: any) => {
        const _mesh = _child as Mesh<any, MeshBasicMaterial>
        await CustomAnimation().fadeOut(_mesh, fadeTo, step);
      })
    })
    Promise.resolve();
  }

  const fadeIn = async (object: Mesh<any, MeshBasicMaterial>, fadeTo: number, step: number) => {
    while (object.material.opacity + step <= fadeTo) {
      await Common().awaitTimeout(AnimationDefaults.timing.fadeUpdateTime);
      object.material.opacity += step;
    }
    Promise.resolve();
  };

  const fadeInGroups = async (_groups: Array<Group>, fadeTo: number, step: number) => {
    for (const _group of _groups) {
      _group.children.map(async _child => {
        const _mesh = _child as Mesh<any, MeshBasicMaterial>;
        await CustomAnimation().fadeIn(_mesh, fadeTo, step);
      })
    }
    Promise.resolve();
  }

  const grow = async (object: Mesh<any, MeshBasicMaterial>, scaleTo: number, step: number) => {
    while (object.scale.x + step < scaleTo) {
      await Common().awaitTimeout(AnimationDefaults.timing.scaleUpdateTime);
      object.scale.set(object.scale.x + step, object.scale.x + step, object.scale.x + step)
    }
    Promise.resolve();
  };

  const shrink = async (object: Mesh<any, MeshBasicMaterial>, scaleTo: number, step: number) => {
    while (object.scale.x - step > scaleTo) {
      await Common().awaitTimeout(AnimationDefaults.timing.scaleUpdateTime);
      Common().setScale(object, object.scale.x - step);
    }
    Promise.resolve();
  };

  return {
    fadeOut,
    fadeOutGroups,
    fadeIn,
    fadeInGroups,
    grow,
    shrink,
  }
};

export default CustomAnimation;