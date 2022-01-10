import {
  ComponentMetadata,
  Entity,
  Story,
  Frame
} from '@/models/GraphqlModel';
import Common from './common';
import useStory from './useStory';

const useFrame = (): {
  GetFrameTitles: (frames: Array<Entity>) => Array<string>;
  GetFrameMainImage: (frame: Entity) => string;
  GetFramesMainImages: (frames: Array<Entity>) => Array<string>;
  CreateFrameRecord: (frames: any) => Record<string, string>;
  getLastAssetRelationMetadata: (activeStoryData: Story, currentFrameIndex: number) => ComponentMetadata;
  getAudioForFrame: (frame: Frame) => string;
  getRelationMetadata: (frame: Frame) => Array<ComponentMetadata>; 
  getStartTimestampsWithTheirAsset: (frame: Frame) => Record<string,number>; 
} => {
  const GetFrameTitles = (frames: Array<Entity>) => {
    const centerWords: Array<string> = [];
    for (const frame of frames) {
      centerWords.push(useStory().Title(frame));
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
      const title = useStory().Title(frame);
      const imageLink = frame.mediafiles?.[0]?.original_file_location
        ? frame.mediafiles?.[0]?.original_file_location
        : 'http://localhost:8001/download/4226243bcfd8986cc128e5f5241589b9-2015-0070.JPG';
      record[title] = imageLink as string;
    }
    return record;
  };

  const getLastAssetRelationMetadata = (activeStoryData: Story, currentFrameIndex: number) => {
    let relationMetadata = Common().connectRelationMetadata(
      activeStoryData.frames[currentFrameIndex],
      activeStoryData.frames[currentFrameIndex].assets[0],
    );
    activeStoryData.frames[currentFrameIndex].assets.forEach((asset) => {
      const data = Common().connectRelationMetadata(
        activeStoryData.frames[currentFrameIndex],
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
    let audio = 'No audio for frame';
    audioFiles = [...frame.relationMetadata.filter(_data => _data.audioFile?.includes('download')).map(_item => _item.audioFile as string)];
    if(audioFiles.length >0){
      audio = audioFiles[0];
    }
    console.log({audio});
    return audio;
  }

  const getRelationMetadata = (frame: Frame) => {
    return frame.relationMetadata;
  };

  const getStartTimestampsWithTheirAsset = (frame: Frame) => {
    const relationMetadata = getRelationMetadata(frame)
    const assetWithStartTime: Record<string,number> = {};
    relationMetadata.map(metadata => {
      assetWithStartTime[Common().FilterOutIdAfterSlash(metadata.key)] = metadata.timestamp_start;
    })
    return assetWithStartTime;
  }

  return {
    GetFrameTitles,
    GetFrameMainImage,
    GetFramesMainImages,
    CreateFrameRecord,
    getLastAssetRelationMetadata,
    getAudioForFrame,
    getRelationMetadata,
    getStartTimestampsWithTheirAsset,
  };
};

export default useFrame;
