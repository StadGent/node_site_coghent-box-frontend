import {
  boxVisiter,
  GetActiveBoxDocument,
  selectedStory,
} from 'coghent-vue-3-component-library';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { Entity } from 'coghent-vue-3-component-library/lib/queries';
import { Asset, Frame } from '@/models/GraphqlModel';

const getBoxVisitEntityById = (id: string) => {
  const { result: activeBoxResult, loading: loadingActiveBoxResult } =
    useQuery(GetActiveBoxDocument);

  const story: Entity = activeBoxResult.value.ActiveBox.results.find(
    (result: Entity) => result.id == selectedStory.value.id,
  );

  story.frames?.forEach((frame: any) => {
    const entity: Entity = frame.assets.find((asset: Asset) => asset.id == id);
    if (entity) {
      return entity as Entity;
    }
  });
};

export { getBoxVisitEntityById };
