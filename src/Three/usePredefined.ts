import { Mesh, MeshBasicMaterial, BoxBufferGeometry, Group } from 'three';
import Frame1 from '@/frames/Frame1';
import Defaults from './defaults.config';

const usePredefined = (): {
  BaseStoryCircle: (
    title: string,
    storyItems: Record<string, string>,
    showWords: true | false,
  ) => Array<Group> | Mesh<BoxBufferGeometry, MeshBasicMaterial>[] | any;
} => {
  const BaseStoryCircle = (
    title: string,
    storyItems: Record<string, string>,
    showWords: true | false,
  ) => {
    const frame1 = Frame1().Create(title, storyItems, showWords, Defaults().Circle());

    return frame1;
  };

  return { BaseStoryCircle };
};

export default usePredefined;
