import {
  boxVisiter,
  GetActiveBoxDocument,
  selectedStory,
} from 'coghent-vue-3-component-library';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { Entity } from 'coghent-vue-3-component-library/lib/queries';
import { Asset, Frame } from '@/models/GraphqlModel';

const getBoxVisitEntitiesById = (idArray: Array<String>) => {
  const { result: activeBoxResult, loading: loadingActiveBoxResult } =
    useQuery(GetActiveBoxDocument);

  const story: Entity = activeBoxResult.value.ActiveBox.results.find(
    (result: Entity) => result.id == selectedStory.value.id,
  );

  const boxVisitEntities: Entity[] = [];
  idArray.forEach((id: String) => {
    story.frames?.forEach((frame: any) => {
      const entity: Entity = frame.assets.find((asset: Asset) => asset.id == id);
      boxVisitEntities.push(entity);
    });
  });

  console.log({ boxVisitEntities });
  console.log({ story });
  console.log({ selectedStory });

  return boxVisitEntities as Array<Entity>;
};

export { getBoxVisitEntitiesById };
