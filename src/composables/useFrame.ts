import {
  ComponentMetadata,
  Story,
  Frame,
  Asset
} from '@/models/GraphqlModel';
import ThreeService from '@/services/ThreeService';
import { Entity } from 'coghent-vue-3-component-library/lib/queries';
import Common from './common';
import useAsset from './useAsset';

const useFrame = (_threeService: ThreeService): {
  title: (_frame: Entity) => string;
  GetFrameTitles: (frames: Array<Entity>) => Array<string>;
  GetFrameMainImage: (frame: Entity) => string;
  GetFramesMainImages: (frames: Array<Entity>) => Array<string>;
  CreateFrameRecord: (frames: any) => Record<string, string>;
  getLastAssetRelationMetadata: (activeStoryData: Entity, currentFrameIndex: number) => ComponentMetadata;
  getAudioForFrame: (frame: Frame) => string | null;
  getSubtitleForFrame: (frame: Frame) => string | null;
  getRelationMetadata: (frame: Frame) => Array<ComponentMetadata>;
  getStartTimestampsWithTheirAsset: (frame: Frame) => Record<string, number>;
} => {
  const title = (_frame: Entity) => {
    let _title = '';
    if (_frame.title && _frame.title.length > 0)
      _title = _frame.title[0]?.value as string
    return _title;
  };

  const GetFrameTitles = (frames: Array<Entity>) => {
    const centerWords: Array<string> = [];
    for (const frame of frames) {
      centerWords.push(title(frame));
    }
    return centerWords;
  };

  const GetFrameMainImage = (frame: Entity) => {
    const imageLink = frame.mediafiles?.[0]?.original_file_location
      ? frame.mediafiles?.[0]?.original_file_location
      : '';
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
      const _title = title(frame);
      const imageLink = frame.mediafiles?.[0]?.original_file_location
        ? frame.mediafiles?.[0]?.original_file_location
        : '';
      record[_title] = imageLink as string;
    }
    return record;
  };

  const getLastAssetRelationMetadata = (activeStory: any, currentFrameIndex: number) => {
    let relationMetadata = useAsset(_threeService).connectRelationMetadata(
      activeStory.frames?.[currentFrameIndex] as unknown as Frame,
      activeStory.frames[currentFrameIndex]?.assets[0] as unknown as Asset,
    );
    activeStory.frames[currentFrameIndex].assets.forEach((asset: Frame | Asset) => {
      const data = useAsset(_threeService).connectRelationMetadata(
        activeStory.frames[currentFrameIndex],
        asset,
      );
      if (data.timestamp_end > relationMetadata.timestamp_end) {
        relationMetadata = data;
      }
    });
    return relationMetadata;
  };

  const getAudioForFrame = (frame: Frame) => {
    let audioFiles: Array<string> = [];
    let audio = null;
    audioFiles = [...frame.relationMetadata.filter(_data => _data.audioFile?.includes('download')).map(_item => _item.audioFile as string)];
    if (audioFiles.length > 0 && audioFiles[0].includes('.mp3')) {
      audio = audioFiles[0];
    }
    console.log({ audio });
    return audio;
  };

  const getSubtitleForFrame = (frame: Frame) => {
    let subtitle = null;
    if (frame.relationMetadata) {
      const subtitles = frame.relationMetadata.filter(_item => _item.subtitleFile);
      if (subtitles.length > 0)
        subtitle = subtitles[0].subtitleFile;
    }
    return subtitle
  };

  const getRelationMetadata = (frame: Frame) => {
    return frame.relationMetadata;
  };

  const getStartTimestampsWithTheirAsset = (frame: Frame) => {
    const relationMetadata = getRelationMetadata(frame);
    const assetWithStartTime: Record<string, number> = {};
    relationMetadata.map(metadata => {
      if (!metadata.key.includes('mediafiles/')) {
        assetWithStartTime[Common().FilterOutIdAfterSlash(metadata.key)] = metadata.timestamp_start;
      }
    })
    return assetWithStartTime;
  }

  return {
    title,
    GetFrameTitles,
    GetFrameMainImage,
    GetFramesMainImages,
    CreateFrameRecord,
    getLastAssetRelationMetadata,
    getAudioForFrame,
    getSubtitleForFrame,
    getRelationMetadata,
    getStartTimestampsWithTheirAsset,
  };
};

export default useFrame;
