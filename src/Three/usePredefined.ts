import { Mesh, MeshBasicMaterial, BoxBufferGeometry, Group } from 'three';
import Frame1 from '@/frames/Frame1';
import Defaults from './defaults.config';

const usePredefined = (): {
  BaseStoryCircle: (
    title: string,
    words: Array<string>,
  ) => Array<Group> | Mesh<BoxBufferGeometry, MeshBasicMaterial>[] | any;
} => {
  const BaseStoryCircle = (title: string, words: Array<string>) => {
    const frame1 = Frame1().Create(title, Defaults().Circle(), words);

    return frame1;
  };

  return { BaseStoryCircle };
};

export default usePredefined;
