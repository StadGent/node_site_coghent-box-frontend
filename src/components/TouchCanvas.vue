<template>
  <canvas id="canvas" class="w-screen h-screen" />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useMutation, useQuery, useResult } from '@vue/apollo-composable';
import FabricService from '../services/Fabric/FabricService';
import { GetEntitiesDocument} from 'coghent-vue-3-component-library'

export default defineComponent({
  name: 'TouchTable',
  components: {
  },
  setup: (props) => {

    const { result, loading, fetchMore, onResult, refetch } = useQuery(
      GetEntitiesDocument,

      () => ({
        limit: 10,
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

    onResult((queryResult) => {
      console.log(queryResult)
    })

    onMounted(() => {
      const fabricService: FabricService = new FabricService();
      fabricService.generateMainImageFrame('/images/testImage.jpg')
      fabricService.generateSecondaryImageFrames(['/images/testImage.jpg', '/images/testImage.jpg', '/images/testImage.jpg', '/images/testImage.jpg', '/images/testImage.jpg', '/images/testImage.jpg', '/images/testImage.jpg'])
      

  })
    return {}
  },
});
</script>

<style scoped>
</style>
