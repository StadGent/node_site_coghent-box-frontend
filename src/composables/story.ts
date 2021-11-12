import { Entity } from 'coghent-vue-3-component-library/lib/queries';
import axios from 'axios';
import { environment as env, environment } from '@/environments';
import { Vector3 } from 'three';
import Defaults from '@/Three/defaults.config';
import { ComponentRelation, Entity as LocalEntity } from '@/models/GraphqlModel';
import { GetFullEntity } from '@/models/GraphqlQueries';

const Story = (): {
  Title: (entity: any) => string;
  GetStoryTitles: (stories: Array<Entity>) => Array<string>;
  GetFrames: (ids: Array<string>) => Promise<Array<Entity>>;
  RelationIds: (story: Entity) => Array<string>;
  GetFrameTitles: (frames: Array<Entity>) => Array<string>;
  GetFrameMainImage: (frame: Entity) => string;
  GetFramesMainImages: (frames: Array<Entity>) => Array<string>;
  CreateCenterWords: (words: Array<string>) => Record<string, Vector3>;
  CreateFrameRecord: (frames: any) => Record<string, string>;
  GetAssetsFromFrame: (frameId: string) => Promise<Record<string, string>>;
} => {
  const FilterOutIdAfterSlash = (str: string) => {
    const index = (str.indexOf('/') as number) + 1;
    const id = str.slice(index);
    return id;
  };

  const GetEntityById = async (id: string) => {
    try {
      const response = await axios({
        url: `${environment.graphqlService}`,
        method: 'post',
        data: {
          query: GetFullEntity,
          variables: {
            id: id,
          },
        },
      });
      return response.data;
    } catch (e) {
      return await Promise.reject();
    }
  };

  const GetRelationComponents = async (id: string) => {
    try {
      const response = await axios.get(`${env.collectionAPI}/entities/${id}/components`);
      return response.data;
    } catch (e) {
      return await Promise.reject();
    }
  };

  const Title = (entity: any) => {
    return entity.title?.[0]?.value ? entity.title?.[0]?.value : 'no title';
  };

  const GetStoryTitles = (stories: Array<Entity>) => {
    const titles: Array<string> = [];
    stories.map((story) => {
      titles.push(Title(story));
    });
    return titles;
  };
  const RelationIds = (story: Entity) => {
    const ids: Array<string> = [];
    story.relations?.forEach((str) => {
      ids.push(FilterOutIdAfterSlash(str?.key as string));
    });
    return ids;
  };

  const ComponentIds = (components: Array<ComponentRelation>) => {
    const ids: Array<string> = [];
    components.forEach((str) => {
      ids.push(FilterOutIdAfterSlash(str?.key as string));
    });
    return ids;
  };

  const GetFrames = async (ids: Array<string>) => {
    const frames: Array<Entity> = [];
    for (const id of ids) {
      const frame = await GetEntityById(id);
      frames.push(frame.data.Entity);
    }
    return frames;
  };

  const GetFrameTitles = (frames: Array<Entity>) => {
    const centerWords: Array<string> = [];
    for (const frame of frames) {
      centerWords.push(Title(frame as LocalEntity));
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
      const title = Title(frame as LocalEntity);
      const imageLink = frame.mediafiles?.[0]?.original_file_location
        ? frame.mediafiles?.[0]?.original_file_location
        : undefined;
      record[title] = imageLink as string;
    }
    return record;
  };

  const CreateCenterWords = (words: Array<string>) => {
    const centerWords: Record<string, Vector3> = {};
    words.forEach((word, index) => {
      centerWords[word] = Defaults().CenterWordPositions()[index];
    });
    return centerWords;
  };

  const GetAssetsFromFrame = async (frameId: string) => {
    const story = await GetEntityById(frameId);
    const components = await GetRelationComponents(story.data.Entity.id);
    const assetIds = ComponentIds(components);
    const assets: Array<Entity> = [];
    for (const id of assetIds) {
      const asset = await GetEntityById(id);
      assets.push(asset.data.Entity);
    }
    return CreateFrameRecord(assets);
  };

  return {
    Title,
    GetStoryTitles,
    RelationIds,
    GetFrames,
    GetFrameTitles,
    GetFrameMainImage,
    GetFramesMainImages,
    CreateCenterWords,
    CreateFrameRecord,
    GetAssetsFromFrame,
  };
};

export default Story;
