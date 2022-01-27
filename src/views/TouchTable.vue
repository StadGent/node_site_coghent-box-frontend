<template>
  <touch-header/>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useMutation, useQuery, useResult } from '@vue/apollo-composable';
import TouchHeader from '@/components/TouchHeader.vue';
import { GetEntityByIdDocument} from 'coghent-vue-3-component-library'
import { useRouter } from 'vue-router'


export default defineComponent({
  name: 'TouchTable',
  components: {
    TouchHeader

  },
  setup: (props) => {
    const router = useRouter()
    const startId: string = '83f2f012-1691-4e02-841f-0cdc85bd81d8'

    router.push('/touchtable/' + startId)

    return {startId}

    
  }
});
</script>

<style scoped>
</style>
