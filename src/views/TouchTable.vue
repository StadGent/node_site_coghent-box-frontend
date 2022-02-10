<template>
  <touch-header/>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import TouchHeader from '@/components/TouchHeader.vue';
import { useRouter } from 'vue-router'


export default defineComponent({
  name: 'TouchTable',
  components: {
    TouchHeader

  },
  setup: (props) => {
    const router = useRouter()
    const startId: string = 'f42792cd-4e59-4dae-8fd0-3997ab4a0ca7'

    router.push('/touchtable/' + startId)

    return {startId}

    
  }
});
</script>

<style scoped>
</style>
