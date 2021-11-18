import { environment as env } from '@/environments';
import { ComponentRelation } from '@/models/GraphqlModel';
import { GetAssetEntity } from '@/models/GraphqlQueries';
import axios from 'axios';

const Common = (): {
  GetEntityById: (id: string) => Promise<any>;
  GetRelationComponents: (id: string) => Promise<Array<ComponentRelation>>;
  FilterOutIdAfterSlash: (str: string) => string;
  RemoveEntersFromString: (str: string) => string;
  ComponentIds: (components: Array<ComponentRelation>) => Array<string>;
} => {
  const GetEntityById = async (id: string) => {
    try {
      const response = await axios({
        url: `${env.graphqlService}`,
        method: 'post',
        data: {
          query: GetAssetEntity,
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

  const FilterOutIdAfterSlash = (str: string) => {
    const index = (str.indexOf('/') as number) + 1;
    const id = str.slice(index);
    return id;
  };

  const RemoveEntersFromString = (str: string) => {
    return str.replace(/\n/g, '');
  };

  const ComponentIds = (components: Array<ComponentRelation>) => {
    const ids: Array<string> = [];
    components.forEach((str) => {
      ids.push(Common().FilterOutIdAfterSlash(str?.key as string));
    });
    return ids;
  };

  return {
    GetEntityById,
    GetRelationComponents,
    FilterOutIdAfterSlash,
    RemoveEntersFromString,
    ComponentIds,
  };
};

export default Common;
