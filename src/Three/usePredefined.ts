import { Mesh, MeshBasicMaterial, BoxBufferGeometry, Group, Vector3 } from 'three';
import Frame1 from '@/frames/Frame1';
import Defaults from './defaults.config';
import LineHelper from './LineHelper';
import SchemaLine from './LineSchema';
import StoryCircleChild from '@/frames/StoryCircleChild';

const usePredefined = (): {
  BaseStoryCircle: (
    title: string,
    storyItems: Record<string, string>,
    showWords: true | false,
  ) => Array<Group>;
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
