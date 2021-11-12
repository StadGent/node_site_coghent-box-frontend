import { ComponentRelation, Entity } from '@/models/GraphqlModel';
import Common from './common';
import Story from './story';

const Frame = (): {
  GetFrames: (ids: Array<string>) => Promise<Array<Entity>>;
  GetFrameTitles: (frames: Array<Entity>) => Array<string>;
  GetFrameMainImage: (frame: Entity) => string;
  GetFramesMainImages: (frames: Array<Entity>) => Array<string>;
  CreateFrameRecord: (frames: any) => Record<string, string>;
  GetAssetsFromFrame: (frameId: string) => Promise<Record<string, string>>;
} => {
  const GetFrames = async (ids: Array<string>) => {
    const frames: Array<Entity> = [];
    for (const id of ids) {
      const frame = await Common().GetEntityById(id);
      frames.push(frame.data.Entity);
    }
    return frames;
  };

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
        : undefined;
      record[title] = imageLink as string;
    }
    return record;
  };

  const ComponentIds = (components: Array<ComponentRelation>) => {
    const ids: Array<string> = [];
    components.forEach((str) => {
      ids.push(Common().FilterOutIdAfterSlash(str?.key as string));
    });
    return ids;
  };

  const GetAssetsFromFrame = async (frameId: string) => {
    const story = await Common().GetEntityById(frameId);
    const components = await Common().GetRelationComponents(story.data.Entity.id);
    const assetIds = ComponentIds(components);
    const assets: Array<Entity> = [];
    for (const id of assetIds) {
      const asset = await Common().GetEntityById(id);
      assets.push(asset.data.Entity);
    }
    return CreateFrameRecord(assets);
  };

  return {
    GetFrames,
    GetFrameTitles,
    GetFrameMainImage,
    GetFramesMainImages,
    CreateFrameRecord,
    GetAssetsFromFrame,
  };
};

export default Frame;
