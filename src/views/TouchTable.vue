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
    const startId: string = '197996d9-6613-42cb-81f9-1dbdfee2635f'

    router.push('/touchtable/' + startId)

    return {startId}

    
  }
});
</script>

<style scoped>
</style>
