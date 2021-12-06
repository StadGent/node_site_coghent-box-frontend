import { Asset, ComponentMetadata, ComponentRelation, Entity, Frame } from '@/models/GraphqlModel';
import Common from './common';
import Story from './useStory';

const Frame = (): {
  GetFrameTitles: (frames: Array<Entity>) => Array<string>;
  GetFrameMainImage: (frame: Entity) => string;
  GetFramesMainImages: (frames: Array<Entity>) => Array<string>;
  CreateFrameRecord: (frames: any) => Record<string, string>;
} => {
  const GetFrameTitles = (frames: Array<Entity>) => {
    const centerWords: Array<string> = [];
    for (const frame of frames) {
      centerWords.push(Story().Title(frame));
    }
    return centerWords;
  };

  const GetFrameMainImage = (frame: Entity) => {
    const imageLink = frame.mediafiles?.[0]?.original_file_location
      ? frame.mediafiles?.[0]?.original_file_location
      : 'http://localhost:8001/download/4226243bcfd8986cc128e5f5241589b9-2015-0070.JPG';
    return imageLink;
  };

  const GetFramesMainImages = (frames: Array<Entity>) => {
    const mainImages: Array<string> = [];
    for (const frame of frames) {
      GetFrameMainImage(frame);
    }
    return mainImages;
  };

  const CreateFrameRecord = (frames: Array<Entity>) => {
    const record: Record<string, string> = {};
    for (const frame of frames) {
      const title = Story().Title(frame);
      const imageLink = frame.mediafiles?.[0]?.original_file_location
        ? frame.mediafiles?.[0]?.original_file_location
        : 'http://localhost:8001/download/4226243bcfd8986cc128e5f5241589b9-2015-0070.JPG';
      record[title] = imageLink as string;
    }
    return record;
  };

  return {
    GetFrameTitles,
    GetFrameMainImage,
    GetFramesMainImages,
    CreateFrameRecord,
  };
};

export default Frame;
