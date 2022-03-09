import { ConfigStore } from '@/stores/ConfigStore'
import StoreFactory from '@/stores/StoreFactory'
import axios from 'axios'

const useTicket = (): {
  print: (_body: string) => Promise<any>
} => {
  const configStore = StoreFactory.get(ConfigStore)
  const print = async (_body: string) => {
    const response = await axios.post(`http://entrance.inuits.local/print`, JSON.parse(_body))
    // const response = await axios.post(`${configStore.config.value.printerService}/print`, JSON.parse(_body))
    console.log('print response', response)
    return response
  }
  return { print }
}

export default useTicket