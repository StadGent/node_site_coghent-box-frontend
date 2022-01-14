<template>
  <canvas id="canvas" class="touchcanvas" />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useMutation, useQuery, useResult } from '@vue/apollo-composable';
import FabricService from '../services/Fabric/FabricService';
import { GetTouchTableEntityDocument} from 'coghent-vue-3-component-library'

export default defineComponent({
  name: 'TouchTable',
  components: {
  },
  setup: (props) => {

     const { result, loading, fetchMore, onResult, refetch } = useQuery(
      GetTouchTableEntityDocument,


      () => ({
        limit: 1,
        skip: 0,
        searchValue: {
          value: '',
          isAsc: false,
          relation_filter: [],
          randomize: true,
          // seed: randomValue.value,
          key: 'title',
          has_mediafile: true,
        },
      }),
      () => ({
        prefetch: false,
      })
    )

    const initializeCanvas= (entities: Array<any>) => {
      const fabricService: FabricService = new FabricService();
      fabricService.generateSecondaryImageFrames(entities)

    }

    onResult((queryResult) => {
      if (queryResult.data){
        console.log(queryResult.data)
        initializeCanvas(queryResult.data.Entities.results)
      }
    })
    return {}
  },
});
</script>

<style scoped>
.touchcanvas {
  width: 3840px;
  height: 2160px;
}
</style>
