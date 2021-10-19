import { FullEntitiesQuery } from '@/models/GraphqlModel';
import { useQuery } from '@vue/apollo-composable';
import {
  GetEntityByIdDocument,
  GetFullEntitiesDocument,
} from 'coghent-vue-3-component-library/lib';

export default class RESTRepository {
  GetFullEntities(params: FullEntitiesQuery) {
    const { result, loading } = useQuery(GetFullEntitiesDocument, params as any);
    return result;
  }
  GetSingleEntity(id: string) {
    console.log('Get from repo');
    const { result, loading } = useQuery(GetEntityByIdDocument, { id: id });
    return result;
  }
}
