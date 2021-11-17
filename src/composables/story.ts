import { Entity } from 'coghent-vue-3-component-library/lib/queries';
import { Vector3 } from 'three';
import Defaults from '@/Three/defaults.config';
import Common from '@/composables/common';

const Story = (): {
  Title: (entity: any) => string;
  GetStoryTitles: (stories: Array<Entity>) => Array<string>;
  RelationIds: (story: Entity) => Array<string>;
  CreateCenterWords: (words: Array<string>) => Record<string, Vector3>;
} => {
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
    const components = story.relations?.filter(
      (relation) => relation?.type == 'components',
    );
    components?.forEach((str) => {
      ids.push(Common().FilterOutIdAfterSlash(str?.key as string));
    });
    return ids;
  };

  const CreateCenterWords = (words: Array<string>) => {
    const centerWords: Record<string, Vector3> = {};
    words.forEach((word, index) => {
      centerWords[word] = Defaults().CenterWordPositions()[index];
    });
    return centerWords;
  };

  return {
    Title,
    GetStoryTitles,
    RelationIds,

    CreateCenterWords,
  };
};

export default Story;
