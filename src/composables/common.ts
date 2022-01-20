import Defaults from '@/Three/defaults.config';
import { Mesh, Vector3 } from 'three';

const Common = (): {
  FilterOutIdAfterSlash: (str: string) => string;
  RemoveEntersFromString: (str: string) => string;
  pixelsToMeters: (pixels: number) => number;
  firstIsBiggest: (first:number, second: number) => boolean;
  awaitTimeout: (time: number) => Promise<unknown>;
  setScale: (_object: Mesh, scale: number) => void;
  setPosition: (_object: Mesh, _position: Vector3) => void;
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
  };

  const firstIsBiggest = (first: number, second: number) => {
    return first > second;
  }

  const awaitTimeout = (time: number) => {
    return new Promise((resolve) =>
      setTimeout(resolve, time),
    );
  }
  const setScale = (_object: Mesh, scale: number) => {
    _object.scale.set(scale,scale,scale);
  }

  const setPosition = (_object: Mesh, _position: Vector3) => {
    _object.position.set(_position.x, _position.y, _position.z);
  };

  return {
    FilterOutIdAfterSlash,
    RemoveEntersFromString,
    pixelsToMeters,
    firstIsBiggest,
    awaitTimeout,
    setScale,
    setPosition,
  };
};

export default Common;
