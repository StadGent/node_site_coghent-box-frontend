import { Tags } from '@/services/TaggingService';
import ThreeService from '@/services/ThreeService';
import AnimationDefaults from '@/Three/defaults.animation';
import Colors from '@/Three/defaults.color';
import Layers from '@/Three/defaults.layers';
import CountDownCircle from '@/Three/shapes.countdownCircle';
import TimerCountdown from '@/Three/shapes.timer';
import { Group, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import Common from './common';

const CustomAnimation = (): {
  fadeOut: (object: Mesh<any, MeshBasicMaterial>, fadeTo: number, step: number) => Promise<void>;
  fadeOutGroups: (_group: Array<Group>, fadeTo: number, step: number) => Promise<void>;
  fadeInGroups: (_group: Array<Group>, fadeTo: number, step: number) => Promise<void>;
  fadeIn: (object: Mesh<any, MeshBasicMaterial>, fadeTo: number, step: number) => Promise<void>;
  grow: (object: Mesh<any, MeshBasicMaterial>, scaleTo: number, step: number) => Promise<void>;
  shrink: (object: Mesh<any, MeshBasicMaterial>, scaleTo: number, step: number) => Promise<void>;
  circularCountdown: (_threeService: ThreeService, _position: Vector3, _radius: number, _thickness: number, _tags: Array<Tags>, _textCorrection: Vector3, _fontSize: number) => Promise<void>
  singleCircularCountdown: (_threeService: ThreeService, _position: Vector3, _radius: number, _thickness: number, _tags: Array<Tags>, _textCorrection: Vector3, _fontSize: number, _count: number) => Promise<void>
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

  const circularCountdown = async (_threeService: ThreeService, _position: Vector3, _radius: number, _thickness: number, _tags: Array<Tags>, _textCorrection: Vector3, _fontSize: number) => {
    const count = [3, 2, 1];
    for (const _count of count) {
      await singleCircularCountdown(_threeService,_position,_radius,_thickness,_tags,_textCorrection,_fontSize,_count)
    }
    Promise.resolve();
  }

  const singleCircularCountdown = async (_threeService: ThreeService, _position: Vector3, _radius: number, _thickness: number, _tags: Array<Tags>, _textCorrection: Vector3, _fontSize: number, _count: number) => {
    const ring = CountDownCircle(_position, 2, _radius, _thickness);
    _threeService.AddToScene(ring, _tags[0]);
      let progress = 0;
      const countdownNumber = await TimerCountdown(_threeService).createNumber(_count.toString(), new Vector3(_position.x + _textCorrection.x, _position.y + _textCorrection.y, Layers.scene), _fontSize);
      _threeService.AddToScene(countdownNumber, _tags[1])
      while (progress <= 1) {
        const ring_progress = CountDownCircle(_position, progress, _radius, _thickness, Colors().white);
        _threeService.AddToScene(ring_progress, _tags[2]);
        await Common().awaitTimeout(27);
        progress += 0.027;
        _threeService.RemoveFromScene(ring_progress);
      }
      _threeService.RemoveFromScene(countdownNumber);
    _threeService.RemoveFromScene(ring);
    Promise.resolve();
  }

  return {
    fadeOut,
    fadeOutGroups,
    fadeIn,
    fadeInGroups,
    grow,
    shrink,
    circularCountdown,
    singleCircularCountdown
  }
};

export default CustomAnimation;