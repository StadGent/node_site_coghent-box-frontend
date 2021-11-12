import { environment as env } from '@/environments';
import { ComponentRelation } from '@/models/GraphqlModel';
import { GetFullEntity } from '@/models/GraphqlQueries';
import axios from 'axios';

const Common = (): {
  GetEntityById: (id: string) => Promise<any>;
  GetRelationComponents: (id: string) => Promise<Array<ComponentRelation>>;
  FilterOutIdAfterSlash: (str: string) => string;
  RemoveEntersFromString: (str: string) => string;
} => {
  const GetEntityById = async (id: string) => {
    try {
      const response = await axios({
        url: `${env.graphqlService}`,
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

  const FilterOutIdAfterSlash = (str: string) => {
    const index = (str.indexOf('/') as number) + 1;
    const id = str.slice(index);
    return id;
  };

  const RemoveEntersFromString = (str: string) => {
    return str.replace(/\n/g, '');
  };
  return {
    GetEntityById,
    GetRelationComponents,
    FilterOutIdAfterSlash,
    RemoveEntersFromString,
  };
};

export default Common;
