import { Entity } from 'coghent-vue-3-component-library/lib/queries';
import axios from 'axios';
import { environment as env } from '@/environments';
import { ComponentRelation } from '@/models/GraphqlModel';
import { Vector3 } from 'three';
import Defaults from '@/Three/defaults.config';

const Story = (): {
  Title: (entity: Entity) => string;
  GetEntity: (id: string) => Promise<any>;
  GetFrameTitle: (entity: Entity) => string;
  FrameIds: (story: Entity) => Array<string>;
  GetOrderComponents: (story: Entity, frame: number) => Promise<any>;
  GetFrameWithAssets: (frame: Entity) => void;
} => {
  const FilterOutIdAfterSlash = (str: string) => {
    const index = (str.indexOf('/') as number) + 1;
    const id = str.slice(index);
    return id;
  };
  const GetEntity = async (id: string) => {
    try {
      const response = await axios.get(`${env.collectionAPI}/entities/${id}`);
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

  const GetMediafileLink = (link: string) => {
    return `${env.storageAPI}${link}`;
  };
  const Title = (entity: Entity) => {
    return entity.title[0]?.value || 'no title';
  };

  const FrameIds = (story: Entity) => {
    const ids: Array<string> = [];
    story.relations?.forEach((str) => {
      ids.push(FilterOutIdAfterSlash(str?.key as string));
    });
    return ids;
  };

  const GetFrameTitle = (frame: Entity) => {
    return frame.metadata.filter((meta) => meta?.key == 'title')[0]?.value as string;
  };

  const GetOrderComponents = async (story: Entity, frame: number) => {
    const components: Array<ComponentRelation> = await GetRelationComponents(
      FrameIds(story)[frame],
    );
    const frames: Record<string, string> = {};
    for (const component of components) {
      const entity = await GetEntity(FilterOutIdAfterSlash(component.key));
      const title = GetFrameTitle(entity);
      const imageLink = entity.primary_mediafile_location
        ? entity.primary_mediafile_location
        : undefined;
      frames[title] = imageLink;
    }
    return { frames: frames, centerWords: CreateCenterWords(Object.keys(frames)) };
  };

  const CreateCenterWords = (words: Array<string>) => {
    const centerWords: Record<string, Vector3> = {};
    words.forEach((word, index) => {
      centerWords[word] = Defaults().CenterWordPositions()[index];
    });
    return centerWords;
  };

  const GetFrameWithAssets = (frame: Entity) => {
    const assets: Array<Entity> = [];
  };

  return {
    Title,
    FrameIds,
    GetEntity,
    GetFrameTitle,
    GetOrderComponents,
    GetFrameWithAssets,
  };
};

export default Story;
